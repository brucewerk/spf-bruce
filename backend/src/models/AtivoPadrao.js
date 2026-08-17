const mongoose = require("mongoose");

const AtivoPadraoSchema = new mongoose.Schema(
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
    tipo: {
      type: String,
      required: true,
      trim: true,
      default: "outro",
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
AtivoPadraoSchema.index({ userId: 1, nome: 1 }, { unique: true });

module.exports = mongoose.model("AtivoPadrao", AtivoPadraoSchema);
