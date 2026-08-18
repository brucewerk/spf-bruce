require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const exercicioRoutes = require("./routes/exercicioRoutes");
const padraoRoutes = require("./routes/padraoRoutes");
const contaRoutes = require("./routes/contaRoutes");
const investimentoRoutes = require("./routes/investimentoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const tipoInvestimentoRoutes = require("./routes/tipoInvestimentoRoutes");
const produtoInvestimentoRoutes = require("./routes/produtoInvestimentoRoutes");
const ativoRoutes = require("./routes/ativoRoutes");
const passivoRoutes = require("./routes/passivoRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Conectar ao MongoDB
connectDB();

// ============================================
// CORS - LOCAL (PERMITIR LOCALHOST)
// ============================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://spf-bruce-frontend.vercel.app",
  "https://spf-bruce.vercel.app",
];

app.use((req, res, next) => {
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
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/exercicios", exercicioRoutes);
app.use("/api/padroes", padraoRoutes);
app.use("/api/contas", contaRoutes);
app.use("/api/investimentos", investimentoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/tipos-investimento", tipoInvestimentoRoutes);
app.use("/api/produtos-investimento", produtoInvestimentoRoutes);
app.use("/api/ativos", ativoRoutes);
app.use("/api/passivos", passivoRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SPF-Bruce Backend rodando!",
    mongodb: "connected",
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "SPF-Bruce API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
    },
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
});

module.exports = app;
