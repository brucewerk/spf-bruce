import { createServer, mergeConfig } from "vite";
import viteConfig from "./vite.config.js";

const merged = mergeConfig(viteConfig, {
  server: { port: 5556, strictPort: true },
  optimizeDeps: { include: ["react", "react-router-dom"] },
});

const server = await createServer(merged);
await server.listen();
console.log("started");
