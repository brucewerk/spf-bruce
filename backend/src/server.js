require("dotenv").config();
const createApp = require("./app");
const connectDB = require("./config/database");
const monitoring = require("./config/monitoring");

monitoring.init();

const app = createApp();

// Conectar ao MongoDB (uma vez, ao subir o processo)
connectDB();

// Erros fora do ciclo request/response (ex.: promise rejeitada sem catch em
// algum lugar) antes só derrubavam o processo sem deixar rastro nenhum.
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  monitoring.captureException(reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
});

module.exports = app;
