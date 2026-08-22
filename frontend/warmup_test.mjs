import { createServer, mergeConfig } from "vite";
import viteConfig from "./vite.config.js";

const merged = mergeConfig(viteConfig, {
  server: {
    port: 5557,
    strictPort: true,
    warmup: {
      clientFiles: [
        "./src/components/**/*.jsx",
        "./src/context/**/*.jsx",
        "./src/hooks/**/*.js",
        "./src/utils/**/*.js",
        "./src/schemas/**/*.js",
        "./src/services/**/*.js",
      ],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios", "zod",
      "@hookform/resolvers/zod", "react-hook-form", "react-hot-toast",
      "recharts", "lucide-react", "@sentry/react"],
  },
});

const t0 = Date.now();
const server = await createServer(merged);
await server.listen();
console.log("server ready in", Date.now() - t0, "ms");

// dá um tempinho pro warmup (assíncrono, não bloqueia o listen) processar
await new Promise((r) => setTimeout(r, 4000));
console.log("after warmup wait:", Date.now() - t0, "ms");
