const mongoose = require("mongoose");

const CategoriaAtivoSchema = new mongoose.Schema(
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
    cor: {
      type: String,
      default: "#3b82f6",
    },
    icone: {
      type: String,
      default: "🏦",
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
CategoriaAtivoSchema.index({ userId: 1, nome: 1 }, { unique: true });

module.exports = mongoose.model("CategoriaAtivo", CategoriaAtivoSchema);
