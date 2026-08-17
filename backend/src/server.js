require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const mongoose = require("mongoose");

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

// Função para sincronizar índices
const syncIndexes = async () => {
  try {
    console.log("🔄 Sincronizando índices...");
    const modelNames = [
      "CategoriaAtivo",
      "CategoriaPassivo",
      "TipoInvestimento",
      "ProdutoInvestimento",
      "AtivoPadrao",
      "PassivoPadrao",
      "InvestimentoPadrao",
    ];

    for (const name of modelNames) {
      try {
        const model = mongoose.model(name);
        await model.syncIndexes();
        console.log(`✅ Índices sincronizados para ${name}`);
      } catch (err) {
        if (err.code === 26) {
          console.log(`⚠️ Modelo ${name} não tem coleção ainda, pulando...`);
        } else {
          console.error(`❌ Erro ao sincronizar ${name}:`, err.message);
        }
      }
    }
    console.log("✅ Sincronização de índices concluída!");
  } catch (error) {
    console.error("❌ Erro ao sincronizar índices:", error);
  }
};

// Chamar a sincronização após a conexão
mongoose.connection.once("open", () => {
  console.log("🔓 Conexão MongoDB estabelecida");
  syncIndexes();
});

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
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

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SPF-Bruce Backend rodando!" });
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
  console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
