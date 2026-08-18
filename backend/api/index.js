// api/index.js - Entry point for Vercel serverless deployment
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { corsMiddleware } = require("../src/config/cors");
const { authLimiter, apiLimiter } = require("../src/middleware/rateLimit");

// Importar rotas
const authRoutes = require("../src/routes/authRoutes");
const exercicioRoutes = require("../src/routes/exercicioRoutes");
const padraoRoutes = require("../src/routes/padraoRoutes");
const contaRoutes = require("../src/routes/contaRoutes");
const investimentoRoutes = require("../src/routes/investimentoRoutes");
const categoriaRoutes = require("../src/routes/categoriaRoutes");
const tipoInvestimentoRoutes = require("../src/routes/tipoInvestimentoRoutes");
const produtoInvestimentoRoutes = require("../src/routes/produtoInvestimentoRoutes");
const ativoRoutes = require("../src/routes/ativoRoutes");
const passivoRoutes = require("../src/routes/passivoRoutes");
const reportRoutes = require("../src/routes/reportRoutes");

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// MongoDB Connection (reaproveita conexão entre invocações serverless)
// ============================================
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ MongoDB conectado!");
    }
  } catch (error) {
    console.error("❌ MongoDB:", error.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ============================================
// ROTAS
// ============================================
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/exercicios", apiLimiter, exercicioRoutes);
app.use("/api/padroes", apiLimiter, padraoRoutes);
app.use("/api/contas", apiLimiter, contaRoutes);
app.use("/api/investimentos", apiLimiter, investimentoRoutes);
app.use("/api/categorias", apiLimiter, categoriaRoutes);
app.use("/api/tipos-investimento", apiLimiter, tipoInvestimentoRoutes);
app.use("/api/produtos-investimento", apiLimiter, produtoInvestimentoRoutes);
app.use("/api/ativos", apiLimiter, ativoRoutes);
app.use("/api/passivos", apiLimiter, passivoRoutes);
app.use("/api/reports", apiLimiter, reportRoutes);

// ============================================
// HEALTH CHECK
// ============================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SPF-Bruce Backend rodando no Vercel!",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

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

// ============================================
// Error Handler — não vaza err.message (podia expor detalhes internos/driver)
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

module.exports = app;
