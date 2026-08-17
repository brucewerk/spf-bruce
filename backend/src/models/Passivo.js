const mongoose = require("mongoose");

const PassivoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
      default: "geral",
    },
    valor: {
      type: Number,
      default: 0,
    },
    dataVencimento: {
      type: Date,
      default: null,
    },
    pago: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Índice para busca por usuário
PassivoSchema.index({ userId: 1, nome: 1 });

module.exports = mongoose.model("Passivo", PassivoSchema);
