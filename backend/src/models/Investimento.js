const mongoose = require("mongoose");

const InvestimentoSchema = new mongoose.Schema(
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
      // REMOVIDO enum para aceitar qualquer valor
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
  },
  { timestamps: true },
);

InvestimentoSchema.index({ userId: 1 });

module.exports = mongoose.model("Investimento", InvestimentoSchema);
