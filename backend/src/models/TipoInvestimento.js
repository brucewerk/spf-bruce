const mongoose = require("mongoose");

const TipoInvestimentoSchema = new mongoose.Schema(
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
      default: "#8b5cf6",
    },
    icone: {
      type: String,
      default: "📈",
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
TipoInvestimentoSchema.index({ userId: 1, nome: 1 }, { unique: true });

module.exports = mongoose.model("TipoInvestimento", TipoInvestimentoSchema);
