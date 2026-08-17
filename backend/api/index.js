// api/index.js - Entry point for Vercel serverless deployment
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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

// Configuração CORS para Vercel
const corsOptions = {
  origin: [
    "https://spf-bruce.vercel.app",
    "http://localhost:5173",
    "https://spf-bruce-git-main-brucewerks-projects.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB conectado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error.message);
  }
};

// Middleware para conectar ao banco em cada requisição
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

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

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SPF-Bruce Backend rodando no Vercel!",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
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
      exercicios: "/api/exercicios",
      contas: "/api/contas",
      investimentos: "/api/investimentos",
      reports: "/api/reports",
    },
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor: " + err.message });
});

// Exportar para Vercel
module.exports = app;
