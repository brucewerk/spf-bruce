// api/index.js - Entry point for Vercel serverless deployment
require("dotenv").config();
const mongoose = require("mongoose");
const createApp = require("../src/app");
const monitoring = require("../src/config/monitoring");

monitoring.init();

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
    monitoring.captureException(error);
  }
};

// Precisa rodar ANTES das rotas — por isso entra como preRouteMiddleware,
// e não como app.use() solto depois do createApp().
const app = createApp({
  preRouteMiddleware: [
    async (req, res, next) => {
      await connectDB();
      next();
    },
  ],
});

module.exports = app;
