import { createStripeWebhook } from "../server/stripe-handlers.js";

export default { fetch: createStripeWebhook() };
