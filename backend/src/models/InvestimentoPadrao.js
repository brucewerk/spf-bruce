const mongoose = require("mongoose");

const InvestimentoPadraoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      trim: true,
    },
    produto: {
      type: String,
      required: true,
      trim: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    emissao: {
      type: Date,
      required: true,
    },
    vencimento: {
      type: Date,
      default: null,
    },
    anos: {
      type: Number,
      default: 0,
    },
    valorCompra: {
      type: Number,
      required: true,
      default: 0,
    },
    saldoBruto: {
      type: Number,
      required: true,
      default: 0,
    },
    rendimento: {
      type: Number,
      default: 0,
    },
    taxaAno: {
      type: Number,
      default: 0,
    },
    irIof: {
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
InvestimentoPadraoSchema.index({ userId: 1, nome: 1 }, { unique: true });

module.exports = mongoose.model("InvestimentoPadrao", InvestimentoPadraoSchema);
