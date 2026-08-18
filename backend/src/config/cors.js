// Lista única de origens permitidas, usada tanto pelo servidor local
// (src/server.js) quanto pelo entrypoint serverless do Vercel (api/index.js).
// Antes esta lista existia duas vezes e podia ficar dessincronizada.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://spf-bruce-frontend.vercel.app",
  "https://spf-bruce.vercel.app",
  "https://spf-bruce-frontend-148ibswy5-kling-klang.vercel.app",
  "https://spf-bruce-frontend-mhv6qrsdz-kling-klang.vercel.app",
  "https://spf-bruce-frontend-fdglxow4k-kling-klang.vercel.app",
];

// Permite adicionar origens extras via variável de ambiente (ex.: novas
// URLs de preview do Vercel) sem precisar alterar código.
if (process.env.EXTRA_ALLOWED_ORIGINS) {
  allowedOrigins.push(
    ...process.env.EXTRA_ALLOWED_ORIGINS.split(",").map((o) => o.trim()),
  );
}

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
};

module.exports = { allowedOrigins, corsMiddleware };
