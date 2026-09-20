import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createOrderHandler } from "./server/order-handler.js";

export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: "local-order-api",
    configureServer(server) {
      const handler = createOrderHandler({ env: { ...loadEnv(mode, process.cwd(), ""), ...process.env } });
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] === "/api/order") return handler(req, res);
        next();
      });
    },
  }],
  server: { port: 5173, open: false },
}));
