import { createPayments } from "./payments.js";

const json = (body, status = 200, headers = {}) => Response.json(body, {
  status, headers: { "Cache-Control": "no-store", ...headers },
});

export function createStripeWebhook({ env = process.env, payments = createPayments({ env }) } = {}) {
  return async (request) => {
    if (request.method !== "POST") return json({ ok: false }, 405, { Allow: "POST" });
    if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) return json({ ok: false }, 503);
    let event;
    try {
      // Signature verification must use the exact bytes, never re-serialized JSON.
      const reader = request.body?.getReader();
      if (!reader) return json({ ok: false }, 400);
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 256 * 1024) { await reader.cancel(); return json({ ok: false }, 413); }
        chunks.push(Buffer.from(value));
      }
      event = payments.verifyEvent(Buffer.concat(chunks), request.headers.get("stripe-signature"));
    } catch { return json({ ok: false }, 400); }
    if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      return json({ ok: true });
    }
    try {
      await payments.fulfill(event.data.object.id);
      return json({ ok: true });
    } catch {
      // Non-2xx asks Stripe to retry delivery; never acknowledge a failed dispatch.
      return json({ ok: false }, 500);
    }
  };
}

export function createOrderStatus({ env = process.env, payments = createPayments({ env }) } = {}) {
  return async (request) => {
    if (request.method !== "GET") return json({ ok: false }, 405, { Allow: "GET" });
    const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
    if (!/^cs_(?:test_|live_)?[a-zA-Z0-9]{10,200}$/.test(sessionId)) return json({ ok: false }, 400);
    try {
      const result = await payments.status(sessionId);
      return result ? json(result) : json({ ok: false }, 404);
    } catch { return json({ ok: false }, 503); }
  };
}
