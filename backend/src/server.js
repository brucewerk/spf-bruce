require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/database");
const { corsMiddleware } = require("./config/cors");
const { authLimiter, apiLimiter } = require("./middleware/rateLimit");

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

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
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

// Middleware de erro — nunca vaza detalhes internos (stack, msg de driver) ao cliente
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
