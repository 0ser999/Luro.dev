import { randomUUID } from "node:crypto";
import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import { ORDER_CURRENCY, ORDER_SERVICES } from "../src/order-config.js";

const RETENTION = 30 * 24 * 60 * 60;
const key = (id) => `luro:order:${id}`;
const sessionKey = (id) => `luro:checkout:${id}`;
const clip = (value) => String(value).slice(0, 1024);

export function createPayments({ env = process.env, stripeClient, redisClient, fetchImpl = fetch } = {}) {
  let stripe = stripeClient;
  let redis = redisClient;
  function clients() {
    stripe ??= new Stripe(env.STRIPE_SECRET_KEY, { timeout: 8000, maxNetworkRetries: 1 });
    redis ??= new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
    return { stripe, redis };
  }

  return {
    async createCheckout(order, lang) {
      if (!env.STRIPE_WEBHOOK_SECRET || !env.DISCORD_WEBHOOK_URL) throw new Error("configuration");
      const rawUrl = env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "https://luro.lol"));
      const origin = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
      if (origin.protocol !== "https:" && !(env.VERCEL !== "1" && ["localhost", "127.0.0.1"].includes(origin.hostname))) {
        throw new Error("origin");
      }
      const { stripe, redis } = clients();
      const service = ORDER_SERVICES[order.service];
      const id = randomUUID();
      const record = { ...order, id, amount: service.amount, currency: ORDER_CURRENCY,
        serviceLabel: service.fr, status: "pending", createdAt: new Date().toISOString() };
      // Persist the brief before offering payment. No personal data is put in Stripe metadata.
      await redis.set(key(id), record, { ex: RETENTION });
      const session = await stripe.checkout.sessions.create({
        mode: "payment", payment_method_types: ["card"], locale: lang,
        adaptive_pricing: { enabled: false },
        customer_email: order.email,
        client_reference_id: id, metadata: { order_id: id },
        line_items: [{ quantity: 1, price_data: { currency: record.currency,
          unit_amount: record.amount, product_data: { name: service[lang] } } }],
        success_url: `${origin.origin}/reservation.html?payment=success&session_id={CHECKOUT_SESSION_ID}#contact`,
        cancel_url: `${origin.origin}/reservation.html?payment=cancelled#contact`,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      }, { idempotencyKey: id });
      if (!session.url || !session.id) throw new Error("checkout");
      await redis.set(key(id), { ...record, sessionId: session.id }, { ex: RETENTION });
      await redis.set(sessionKey(session.id), id, { ex: RETENTION });
      return { checkoutUrl: session.url };
    },

    verifyEvent(raw, signature) {
      return clients().stripe.webhooks.constructEvent(raw, signature, env.STRIPE_WEBHOOK_SECRET);
    },

    async fulfill(sessionId) {
      const { stripe, redis } = clients();
      // Re-read from Stripe; browser query parameters are never proof of payment.
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") return;
      const id = session.metadata?.order_id;
      if (!id || !/^[a-f0-9-]{36}$/.test(id)) return;
      const lockKey = `${key(id)}:lock`;
      const owner = randomUUID();
      if (!await redis.set(lockKey, owner, { nx: true, ex: 120 })) throw new Error("busy");
      try {
        const order = await redis.get(key(id));
        if (!order) throw new Error("missing-order");
        if (order.sessionId !== session.id || session.client_reference_id !== id ||
            session.amount_total !== order.amount || session.currency !== order.currency) throw new Error("payment-mismatch");
        if (order.status === "sent") return;
        const paid = { ...order, status: "paid" };
        await redis.set(key(id), paid, { ex: RETENTION });
        const webhook = new URL(env.DISCORD_WEBHOOK_URL);
        webhook.searchParams.set("wait", "true");
        const response = await fetchImpl(webhook, {
          method: "POST", headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds: [{
            title: "Nouvelle commande", color: 0x5865F2,
            fields: [
              ["Nom", order.name], ["Email", order.email], ["Discord", order.discord || "Non précisé"],
              ["Service", order.serviceLabel], ["Paiement", `${(order.amount / 100).toFixed(2)} ${order.currency.toUpperCase()} — payé`],
              ["Message", order.message], ["Référence", id],
            ].map(([name, value]) => ({ name, value: clip(value), inline: !["Message", "Référence"].includes(name) })),
            timestamp: new Date().toISOString(),
          }] }),
        });
        if (!response.ok) throw new Error("discord");
        const message = await response.json();
        if (!message.id) throw new Error("discord-confirmation");
        await redis.set(key(id), { ...paid, status: "sent", discordMessageId: message.id }, { ex: RETENTION });
      } finally {
        // Release only our own lock, even if a slow request outlives its lease.
        await redis.eval("if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end", [lockKey], [owner]);
      }
    },

    async status(sessionId) {
      const { redis } = clients();
      const id = await redis.get(sessionKey(sessionId));
      const order = id ? await redis.get(key(id)) : null;
      return order ? { status: order.status } : null;
    },
  };
}
