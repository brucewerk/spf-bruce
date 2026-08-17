const mongoose = require("mongoose");

const AtivoSchema = new mongoose.Schema(
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
    valor: {
      type: Number,
      default: 0,
    },
    dataAquisicao: {
      type: Date,
      default: null,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Índice para busca por usuário
AtivoSchema.index({ userId: 1, nome: 1 });

module.exports = mongoose.model("Ativo", AtivoSchema);
