// backend/index.js - Entry point para Vercel
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Importar rotas
const authRoutes = require("./src/routes/authRoutes");
const exercicioRoutes = require("./src/routes/exercicioRoutes");
const padraoRoutes = require("./src/routes/padraoRoutes");
const contaRoutes = require("./src/routes/contaRoutes");
const investimentoRoutes = require("./src/routes/investimentoRoutes");
const categoriaRoutes = require("./src/routes/categoriaRoutes");
const tipoInvestimentoRoutes = require("./src/routes/tipoInvestimentoRoutes");
const produtoInvestimentoRoutes = require("./src/routes/produtoInvestimentoRoutes");
const ativoRoutes = require("./src/routes/ativoRoutes");
const passivoRoutes = require("./src/routes/passivoRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

const app = express();

// ============================================
// CORS - Configuração para produção
// ============================================
const allowedOrigins = [
  "https://spf-bruce-frontend.vercel.app",
  "https://spf-bruce-frontend-148ibswy5-kling-klang.vercel.app",
  "https://spf-bruce-frontend-mhv6qrsdz-kling-klang.vercel.app",
  "https://spf-bruce-frontend-fdglxow4k-kling-klang.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
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

// ============================================
// MongoDB Connection
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
// Rotas
// ============================================
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

// ============================================
// Health Check
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
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
