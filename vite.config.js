import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createOrderHandler } from "./server/order-handler.js";
import { createStripeWebhook, createOrderStatus } from "./server/stripe-handlers.js";

export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: "local-order-api",
    configureServer(server) {
      const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
      const handler = createOrderHandler({ env });
      const webHandlers = { "/api/stripe-webhook": createStripeWebhook({ env }), "/api/order-status": createOrderStatus({ env }) };
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] === "/api/order") return handler(req, res);
        const webHandler = webHandlers[req.url?.split("?")[0]];
        if (webHandler) {
          try {
            const request = new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers,
              ...(!["GET", "HEAD"].includes(req.method) ? { body: req, duplex: "half" } : {}) });
            const response = await webHandler(request);
            res.statusCode = response.status;
            response.headers.forEach((value, name) => res.setHeader(name, value));
            res.end(Buffer.from(await response.arrayBuffer()));
          } catch { res.statusCode = 500; res.end('{"ok":false}'); }
          return;
        }
        next();
      });
    },
  }],
  server: { port: 5173, open: false },
}));
