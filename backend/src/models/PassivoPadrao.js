const mongoose = require("mongoose");

const PassivoPadraoSchema = new mongoose.Schema(
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
    valorBase: {
      type: Number,
      default: 0,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    ordem: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Índice composto: cada usuário pode ter nomes únicos
PassivoPadraoSchema.index({ userId: 1, nome: 1 }, { unique: true });

module.exports = mongoose.model("PassivoPadrao", PassivoPadraoSchema);
