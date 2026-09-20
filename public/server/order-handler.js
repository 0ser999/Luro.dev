import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ORDER_LIMITS, ORDER_SERVICES } from "../src/order-config.js";
import { createPayments } from "./payments.js";

const MAX_BODY_BYTES = 16 * 1024;
const UNAVAILABLE = "Envoi indisponible pour le moment. Réessaie plus tard.";

function reply(res, status, code, message, data = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(status === 200 ? { ok: true, ...data } : { ok: false, code, message }));
}

async function readBody(req) {
  if (Number(req.headers["content-length"]) > MAX_BODY_BYTES) throw new Error("body");
  let raw = req.body;
  if (raw === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) throw new Error("body");
      chunks.push(Buffer.from(chunk));
    }
    raw = Buffer.concat(chunks).toString("utf8");
  }
  if (Buffer.isBuffer(raw)) raw = raw.toString("utf8");
  if (Buffer.byteLength(typeof raw === "string" ? raw : JSON.stringify(raw)) > MAX_BODY_BYTES) {
    throw new Error("body");
  }
  const body = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("body");
  return body;
}

function visitorIp(req, env) {
  // Only trust Vercel's overwritten header in production; ignore forwarded headers locally.
  const source = env.VERCEL === "1"
    ? req.headers["x-vercel-forwarded-for"]
    : req.socket?.remoteAddress;
  let ip = typeof source === "string" ? source.split(",")[0].trim() : "";
  if (ip.startsWith("::ffff:") && isIP(ip.slice(7)) === 4) ip = ip.slice(7);
  if (!isIP(ip)) throw new Error("ip");
  return ip;
}

function validate(body) {
  const order = {};
  for (const [field, max] of Object.entries(ORDER_LIMITS)) {
    const value = body[field] ?? (field === "discord" ? "" : undefined);
    if (typeof value !== "string" || value.length > max) return null;
    order[field] = value.trim();
    if (field !== "discord" && !order[field]) return null;
  }
  if (order.message.length < 20 || typeof body.service !== "string" ||
      !Object.hasOwn(ORDER_SERVICES, body.service)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) return null;
  order.service = body.service;
  // Count full URLs, www links and bare domains (including Discord invite links).
  const links = order.message.match(/\b(?:https?:\/\/|www\.)[^\s<>]+|\b(?:[\p{L}\p{N}][\p{L}\p{N}-]*\.)+[\p{L}]{2,63}(?:[/:?#][^\s<>]*)?/giu);
  if ((links?.length ?? 0) > 2) return null;
  return order;
}

export function createOrderHandler({ env = process.env, fetchImpl = fetch, rateLimit, payments = createPayments({ env }) } = {}) {
  let limiter;
  async function limit(ip) {
    if (rateLimit) return rateLimit(ip);
    limiter ??= new Ratelimit({
      redis: new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "luro:orders",
      analytics: false,
      timeout: 5000,
    });
    const identifier = createHash("sha256").update(ip).digest("hex");
    return limiter.limit(identifier);
  }

  return async function orderHandler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return reply(res, 405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] ?? "")) {
      return reply(res, 415, "INVALID_REQUEST", "Une requête JSON est attendue.");
    }
    let body;
    try { body = await readBody(req); }
    catch { return reply(res, 400, "INVALID_REQUEST", "Requête invalide ou trop volumineuse."); }

    if (typeof body.website === "string" && body.website.length) return reply(res, 200);
    const token = body["cf-turnstile-response"];
    if (typeof token !== "string" || !token.trim() || token.length > 2048) {
      return reply(res, 403, "CAPTCHA_FAILED", "Valide la vérification anti-spam, puis réessaie.");
    }
    const order = validate(body);
    if (!order || (body.website !== undefined && typeof body.website !== "string")) {
      return reply(res, 400, "INVALID_FIELDS", "Vérifie les champs, les longueurs et la limite de deux liens.");
    }

    try {
      if (!env.TURNSTILE_SECRET || !env.DISCORD_WEBHOOK_URL ||
          (!rateLimit && (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN))) {
        throw new Error("configuration");
      }
      const ip = visitorIp(req, env);
      const verification = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(8000),
      });
      if (!verification.ok) throw new Error("verification-unavailable");
      const result = await verification.json();
      if (result.success !== true) {
        return reply(res, 403, "CAPTCHA_FAILED", "Valide la vérification anti-spam, puis réessaie.");
      }
      const quota = await limit(ip);
      // Upstash normally allows on timeout. Never let an outage bypass the limit.
      if (quota.reason === "timeout") throw new Error("rate-limit-unavailable");
      await quota.pending;
      if (!quota.success) {
        res.setHeader("Retry-After", String(Math.max(1, Math.ceil((quota.reset - Date.now()) / 1000))));
        return reply(res, 429, "RATE_LIMITED", "Limite de trois envois par heure atteinte. Réessaie plus tard.");
      }
      const checkout = await payments.createCheckout(order, body.lang === "en" ? "en" : "fr");
      return reply(res, 200, undefined, undefined, checkout);
    } catch {
      return reply(res, 503, "UNAVAILABLE", UNAVAILABLE);
    }
  };
}
