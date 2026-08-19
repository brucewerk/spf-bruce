const express = require("express");
const helmet = require("helmet");
const { corsMiddleware } = require("./config/cors");
const { authLimiter, apiLimiter } = require("./middleware/rateLimit");
const monitoring = require("./config/monitoring");

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

// Monta o app Express puro (sem conectar ao Mongo e sem app.listen).
// - src/server.js usa isso pra rodar localmente com nodemon.
// - api/index.js usa isso como handler serverless no Vercel.
// - tests/*.test.js usa isso com supertest, sem precisar de servidor de verdade.
// Antes esse bloco inteiro (helmet, cors, rotas, error handler) existia
// duplicado nos dois entrypoints, com risco real de ficarem dessincronizados.
//
// `preRouteMiddleware` roda depois do parsing do body e ANTES de qualquer
// rota — é onde o api/index.js pluga a conexão lazy ao Mongo (precisa
// acontecer antes das rotas tentarem usar o banco; se fosse registrado
// depois de createApp() já ter montado as rotas, nunca seria executado).
const createApp = ({ preRouteMiddleware = [] } = {}) => {
  const app = express();

  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  preRouteMiddleware.forEach((mw) => app.use(mw));

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

  app.get("/api/health", (req, res) => {
    const mongoose = require("mongoose");
    res.json({
      status: "OK",
      message: "SPF-Bruce Backend rodando!",
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

  // Nunca vaza detalhes internos (stack, msg de driver) ao cliente
  app.use((err, req, res, next) => {
    console.error("❌ Erro:", err.stack);
    monitoring.captureException(err, {
      path: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({ error: "Erro interno do servidor" });
  });

  return app;
};

module.exports = createApp;
