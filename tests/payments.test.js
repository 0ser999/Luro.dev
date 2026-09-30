import test from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";
import { createPayments } from "../server/payments.js";
import { createOrderStatus, createStripeWebhook } from "../server/stripe-handlers.js";
import { ORDER_SERVICES } from "../src/order-config.js";

const env = { STRIPE_SECRET_KEY: "sk_test_placeholder", STRIPE_WEBHOOK_SECRET: "whsec_test_placeholder",
  DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/test/test", SITE_URL: "https://luro.lol" };
const order = { name: "Camille", email: "camille@example.com", discord: "", service: "pc", message: "Je souhaite optimiser mon ordinateur." };
const sessionId = "cs_test_abcdefghijklmnop";

function fixture() {
  const records = new Map();
  const deliveries = [];
  const creations = [];
  const redis = {
    async get(key) { return structuredClone(records.get(key) ?? null); },
    async set(key, value, options = {}) {
      if (options.nx && records.has(key)) return null;
      records.set(key, structuredClone(value));
      return "OK";
    },
    async eval(script, keys, args) { if (records.get(keys[0]) === args[0]) records.delete(keys[0]); },
  };
  let session;
  const stripe = {
    webhooks: new Stripe(env.STRIPE_SECRET_KEY).webhooks,
    checkout: { sessions: {
      async create(params) {
        creations.push(params);
        session = { id: sessionId, url: "https://checkout.stripe.com/c/pay/test", ...params,
          status: "complete", payment_status: "paid", amount_total: params.line_items[0].price_data.unit_amount,
          currency: params.line_items[0].price_data.currency };
        return session;
      },
      async retrieve() { return session; },
    } },
  };
  let fetchImpl = async (url, init) => { deliveries.push(JSON.parse(init.body)); return Response.json({ id: "message-id" }); };
  const payments = createPayments({ env, redisClient: redis, stripeClient: stripe,
    fetchImpl: (...args) => fetchImpl(...args) });
  return { payments, records, deliveries, creations, redis, stripe, get session() { return session; },
    setFetch: (fn) => { fetchImpl = fn; } };
}

test("catalog sums Windows and BIOS to exactly 90 USD", () => {
  assert.equal(ORDER_SERVICES.pc.amount, 9000);
  assert.equal(ORDER_SERVICES.windows.amount + ORDER_SERVICES.bios.amount, 9000);
});

test("Checkout uses server prices, binds required email and stores brief before payment", async () => {
  const f = fixture();
  await f.payments.createCheckout({ ...order, amount: 1, currency: "eur" }, "fr");
  const checkout = f.creations[0];
  const success = new URL(checkout.success_url);
  const cancel = new URL(checkout.cancel_url);
  assert.equal(success.pathname, "/reservation.html");
  assert.equal(success.searchParams.get("payment"), "success");
  assert.equal(success.searchParams.get("session_id"), "{CHECKOUT_SESSION_ID}");
  assert.equal(cancel.pathname, "/reservation.html");
  assert.equal(cancel.searchParams.get("payment"), "cancelled");
  assert.equal(checkout.line_items[0].price_data.unit_amount, 9000);
  assert.equal(checkout.line_items[0].price_data.currency, "usd");
  assert.deepEqual(checkout.adaptive_pricing, { enabled: false });
  assert.equal(checkout.customer_email, order.email);
  assert.equal(checkout.metadata.order_id, checkout.client_reference_id);
  assert.deepEqual(Object.keys(checkout.metadata), ["order_id"]);
  assert.equal(f.records.get(`luro:order:${checkout.client_reference_id}`).message, order.message);
  assert.equal(f.deliveries.length, 0);
});

test("failure to persist the brief prevents Checkout creation", async () => {
  const f = fixture();
  f.redis.set = async () => { throw new Error("redis-unavailable"); };
  await assert.rejects(f.payments.createCheckout(order, "en"));
  assert.equal(f.creations.length, 0);
});

test("unpaid or incomplete sessions never send a Discord message", async () => {
  for (const changes of [{ payment_status: "unpaid" }, { status: "open" }, { mode: "subscription" }]) {
    const f = fixture();
    await f.payments.createCheckout(order, "fr");
    Object.assign(f.session, changes);
    await f.payments.fulfill(sessionId);
    assert.equal(f.deliveries.length, 0);
  }
});

test("wrong price, currency, reference or session never fulfills", async () => {
  for (const changes of [{ amount_total: 1 }, { currency: "eur" }, { client_reference_id: "wrong" }, { id: "wrong" }]) {
    const f = fixture();
    await f.payments.createCheckout(order, "fr");
    Object.assign(f.session, changes);
    await assert.rejects(f.payments.fulfill(sessionId));
    assert.equal(f.deliveries.length, 0);
  }
});

test("confirmed payment sends the embed once, including on webhook replay", async () => {
  const f = fixture();
  await f.payments.createCheckout(order, "fr");
  await f.payments.fulfill(sessionId);
  await f.payments.fulfill(sessionId);
  assert.equal(f.deliveries.length, 1);
  const payload = f.deliveries[0];
  assert.deepEqual(payload.allowed_mentions, { parse: [] });
  const embed = payload.embeds[0];
  assert.equal(embed.title, "Nouvelle commande");
  assert.equal(embed.color, 0x5865F2);
  assert.equal(embed.fields.find((field) => field.name === "Email").value, order.email);
  assert.equal(embed.fields.find((field) => field.name === "Paiement").value, "90.00 USD — payé");
  assert.ok(embed.fields.every((field) => field.value.length <= 1024));
  assert.deepEqual(await f.payments.status(sessionId), { status: "sent" });
});

test("concurrent webhooks cannot deliver while another handler owns the lock", async () => {
  const f = fixture();
  await f.payments.createCheckout(order, "fr");
  let release;
  let started;
  const inFlight = new Promise((resolve) => { started = resolve; });
  f.setFetch(async () => { started(); await new Promise((resolve) => { release = resolve; }); return Response.json({ id: "message" }); });
  const first = f.payments.fulfill(sessionId);
  await inFlight;
  await assert.rejects(f.payments.fulfill(sessionId), /busy/);
  release();
  await first;
  assert.deepEqual(await f.payments.status(sessionId), { status: "sent" });
});

test("failed Discord delivery keeps paid state and can be retried", async () => {
  const f = fixture();
  await f.payments.createCheckout(order, "fr");
  f.setFetch(async () => new Response("error", { status: 500 }));
  await assert.rejects(f.payments.fulfill(sessionId));
  assert.deepEqual(await f.payments.status(sessionId), { status: "paid" });
  f.setFetch(async () => Response.json({ id: "retry-message" }));
  await f.payments.fulfill(sessionId);
  assert.deepEqual(await f.payments.status(sessionId), { status: "sent" });
});

function signedRequest(payload, signature) {
  const header = signature ?? Stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
  return new Request("https://luro.lol/api/stripe-webhook", {
    method: "POST", body: payload, headers: { "content-type": "application/json", "stripe-signature": header },
  });
}

test("webhook verifies the real Stripe signature over exact raw bytes", async () => {
  const f = fixture();
  await f.payments.createCheckout(order, "fr");
  const handler = createStripeWebhook({ env, payments: f.payments });
  const payload = JSON.stringify({ type: "checkout.session.completed", data: { object: { id: sessionId } } }, null, 2);
  assert.equal((await handler(signedRequest(payload, "invalid"))).status, 400);
  assert.equal(f.deliveries.length, 0);
  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
  assert.equal((await handler(signedRequest(payload + " ", signature))).status, 400);
  assert.equal((await handler(signedRequest(payload))).status, 200);
  assert.equal(f.deliveries.length, 1);
});

test("webhook provider failure returns non-2xx so Stripe retries", async () => {
  const f = fixture();
  await f.payments.createCheckout(order, "fr");
  f.setFetch(async () => { throw new Error("private-error"); });
  const handler = createStripeWebhook({ env, payments: f.payments });
  const response = await handler(signedRequest(JSON.stringify({ type: "checkout.session.completed", data: { object: { id: sessionId } } })));
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { ok: false });
});

test("status endpoint returns no personal data and cannot mark an order paid", async () => {
  const f = fixture();
  await f.payments.createCheckout(order, "fr");
  const handler = createOrderStatus({ payments: f.payments });
  const response = await handler(new Request(`https://luro.lol/api/order-status?session_id=${sessionId}&payment=success`));
  assert.deepEqual(await response.json(), { status: "pending" });
  assert.equal((await handler(new Request("https://luro.lol/api/order-status?session_id=fake"))).status, 400);
  assert.equal((await handler(new Request("https://luro.lol/api/order-status?session_id=cs_test_nonexistent12345"))).status, 404);
  assert.equal(f.deliveries.length, 0);
});
