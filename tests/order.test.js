import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { createOrderHandler } from "../server/order-handler.js";

const env = {
  TURNSTILE_SECRET: "test-secret",
  DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/test/test",
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
};
const valid = {
  name: "Camille", contact: "@camille", service: "pc", budget: "", website: "",
  message: "Je souhaite optimiser mon PC pour jouer.", "cf-turnstile-response": "test-token",
};

function fixture(options = {}) {
  const calls = [];
  const ips = [];
  const handler = createOrderHandler({
    env,
    fetchImpl: async (url, init) => {
      calls.push({ url, ...init, body: JSON.parse(init.body) });
      return url.includes("siteverify")
        ? Response.json({ success: true }) : Response.json({ id: "test-message" });
    },
    rateLimit: async (ip) => { ips.push(ip); return { success: true }; },
    ...options,
  });
  async function request(body = valid, changes = {}) {
    const req = { method: "POST", body, headers: { "content-type": "application/json" }, socket: { remoteAddress: "127.0.0.1" }, ...changes };
    const headers = {};
    let json;
    const res = { setHeader: (key, value) => { headers[key] = value; }, end: (raw) => { json = JSON.parse(raw); } };
    await handler(req, res);
    return { status: res.statusCode, headers, json };
  }
  return { handler, request, calls, ips };
}

test("only POST is accepted", async () => {
  const f = fixture();
  for (const method of ["GET", "PUT", "DELETE", "OPTIONS"]) {
    const result = await f.request(valid, { method });
    assert.equal(result.status, 405);
    assert.equal(result.headers.Allow, "POST");
  }
  assert.equal(f.calls.length, 0);
});

test("honeypot silently succeeds without captcha, quota or Discord", async () => {
  const f = fixture();
  for (const website of ["https://spam.example", " "]) {
    assert.equal((await f.request({ website })).status, 200);
  }
  assert.equal(f.calls.length, 0);
  assert.equal(f.ips.length, 0);
});

test("missing, empty, wrong-type and oversized captcha return 403 without network calls", async () => {
  const f = fixture({ env: {} });
  for (const token of [undefined, "", "  ", {}, "x".repeat(2049)]) {
    assert.equal((await f.request({ ...valid, "cf-turnstile-response": token })).status, 403);
  }
  assert.equal(f.calls.length, 0);
});

test("rejects invalid JSON, body types, payload size and content type", async () => {
  const f = fixture();
  for (const body of ["{", "null", [], null, "x".repeat(17000)]) {
    assert.equal((await f.request(body)).status, 400);
  }
  assert.equal((await f.request(valid, { headers: { "content-type": "text/plain" } })).status, 415);
  assert.equal(f.calls.length, 0);
});

test("validates types, required fields, maximum lengths, service and trimmed minimum", async () => {
  const f = fixture();
  for (const invalid of [
    { name: " " }, { name: "a".repeat(81) }, { contact: "" }, { contact: 42 },
    { contact: "a".repeat(201) }, { budget: {} }, { budget: "a".repeat(101) },
    { message: "a".repeat(1001) }, { message: "a".repeat(19) },
    { message: "          short          " }, { service: "unknown" },
    { service: "constructor" }, { website: {} },
  ]) {
    assert.equal((await f.request({ ...valid, ...invalid })).status, 400);
  }
  assert.equal(f.calls.length, 0);
});

test("blocks more than two links, including bare domains", async () => {
  const f = fixture();
  for (const message of [
    "Voici mes liens https://a.fr https://b.fr https://c.fr",
    "Voici mes liens www.a.fr discord.gg/abc example.com",
  ]) assert.equal((await f.request({ ...valid, message })).status, 400);
  assert.equal(f.calls.length, 0);
  assert.equal((await f.request({ ...valid, message: "Voici mes références https://a.fr et https://b.fr" })).status, 200);
});

test("failed captcha never reaches quota or Discord", async () => {
  let calls = 0;
  const f = fixture({ fetchImpl: async () => { calls++; return Response.json({ success: false, "error-codes": ["internal-detail"] }); } });
  const result = await f.request();
  assert.equal(result.status, 403);
  assert.equal(calls, 1);
  assert.equal(f.ips.length, 0);
  assert.ok(!JSON.stringify(result).includes("internal-detail"));
});

test("successful flow verifies token and IP, then sends the requested embed", async () => {
  const f = fixture();
  const result = await f.request();
  assert.equal(result.status, 200);
  assert.equal(result.headers["Cache-Control"], "no-store");
  assert.equal(f.calls.length, 2);
  assert.deepEqual(f.calls[0].body, { secret: "test-secret", response: "test-token", remoteip: "127.0.0.1" });
  assert.ok(f.calls[1].url.endsWith("?wait=true"));
  const payload = f.calls[1].body;
  assert.deepEqual(payload.allowed_mentions, { parse: [] });
  assert.equal(payload.embeds[0].title, "Nouvelle commande");
  assert.equal(payload.embeds[0].color, 0x5865F2);
  assert.deepEqual(payload.embeds[0].fields.map((field) => field.name), ["Nom", "Contact", "Service", "Budget", "Message"]);
  assert.equal(payload.embeds[0].fields[3].value, "Non précisé");
  assert.ok(payload.embeds[0].fields.every((field) => field.value.length <= 1024));
  assert.ok(Number.isFinite(Date.parse(payload.embeds[0].timestamp)));
});

test("uses Vercel's client IP and ignores spoofed local forwarded headers", async () => {
  const production = fixture({ env: { ...env, VERCEL: "1" } });
  await production.request(valid, { headers: { "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.7", "x-forwarded-for": "198.51.100.8" } });
  assert.deepEqual(production.ips, ["203.0.113.7"]);
  const local = fixture();
  await local.request(valid, { headers: { "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.7" } });
  assert.deepEqual(local.ips, ["127.0.0.1"]);
  assert.equal((await production.request()).status, 503);
});

test("Upstash denial returns 429 with Retry-After and never sends to Discord", async () => {
  let count = 0;
  const f = fixture({ rateLimit: async () => ({ success: ++count <= 3, reset: Date.now() + 3600000, pending: Promise.resolve() }) });
  for (let i = 0; i < 3; i++) assert.equal((await f.request()).status, 200);
  const denied = await f.request();
  assert.equal(denied.status, 429);
  assert.ok(Number(denied.headers["Retry-After"]) > 0);
  assert.equal(f.calls.filter((call) => call.url.includes("discord.com")).length, 3);
});

test("Upstash's default timeout success is explicitly refused", async () => {
  const f = fixture({ rateLimit: async () => ({ success: true, reason: "timeout", pending: Promise.resolve() }) });
  assert.equal((await f.request()).status, 503);
  assert.equal(f.calls.length, 1);
});

test("configuration, network and provider failures return generic errors", async () => {
  for (const options of [
    { env: {} },
    { env: { ...env, UPSTASH_REDIS_REST_TOKEN: "" }, rateLimit: undefined },
    { fetchImpl: async () => { throw new Error("sensitive-provider-detail"); } },
    { fetchImpl: async () => new Response("provider-detail", { status: 500 }) },
    { fetchImpl: async () => new Response("not json") },
    { rateLimit: async () => { throw new Error("redis-token"); } },
    { fetchImpl: async (url) => url.includes("siteverify") ? Response.json({ success: true }) : new Response("webhook-detail", { status: 429 }) },
  ]) {
    const result = await fixture(options).request();
    assert.equal(result.status, 503);
    assert.equal(result.json.code, "UNAVAILABLE");
    assert.ok(!JSON.stringify(result).match(/test-secret|detail|redis-token|test-redis-token/));
  }
});

test("reads the native HTTP body used by local Vite development", async () => {
  const f = fixture();
  const req = Readable.from([Buffer.from(JSON.stringify(valid))]);
  req.method = "POST";
  req.headers = { "content-type": "application/json" };
  req.socket = { remoteAddress: "::ffff:127.0.0.1" };
  const res = { setHeader() {}, end(raw) { assert.equal(JSON.parse(raw).ok, true); } };
  await f.handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(f.ips, ["127.0.0.1"]);
});
