require("dotenv").config();
const createApp = require("./app");
const connectDB = require("./config/database");

const app = createApp();

// Conectar ao MongoDB (uma vez, ao subir o processo)
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
});

module.exports = app;
