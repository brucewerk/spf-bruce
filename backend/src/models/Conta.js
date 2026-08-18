const mongoose = require("mongoose");

const ContaSchema = new mongoose.Schema(
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
    banco: {
      type: Number,
      required: true,
    },
    agencia: {
      type: String,
      required: true,
    },
    conta: {
      type: String,
      default: "", // Removido required
    },
    chavePix: {
      type: String,
      default: "",
    },
    tipo: {
      type: String,
      enum: ["corrente", "investimento", "digital", "poupanca"],
      default: "corrente",
    },
    saldoAtual: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

ContaSchema.index({ userId: 1 });

module.exports = mongoose.model("Conta", ContaSchema);
