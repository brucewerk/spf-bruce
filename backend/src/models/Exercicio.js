const mongoose = require("mongoose");

const AtivoExercicioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, default: "outro" },
  valor: { type: Number, default: 0 },
  ordem: { type: Number, default: 0 },
});

const PassivoExercicioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  categoria: { type: String, default: "geral" },
  valor: { type: Number, default: 0 },
  ordem: { type: Number, default: 0 },
});

const InvestimentoExercicioSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  produto: { type: String, required: true },
  nome: { type: String, required: true },
  emissao: { type: Date },
  vencimento: { type: Date, default: null },
  anos: { type: Number, default: 0 },
  valorCompra: { type: Number, default: 0 },
  saldoBruto: { type: Number, default: 0 },
  rendimento: { type: Number, default: 0 },
  taxaAno: { type: Number, default: 0 },
  irIof: { type: Number, default: 0 },
  ordem: { type: Number, default: 0 },
});

const ExercicioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    ativos: [AtivoExercicioSchema],
    passivos: [PassivoExercicioSchema],
    investimentos: [InvestimentoExercicioSchema],
    totalAtivos: {
      type: Number,
      default: 0,
    },
    totalPassivos: {
      type: Number,
      default: 0,
    },
    variacaoMensal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Índice composto para evitar duplicidade mês/ano por usuário
ExercicioSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

// Middleware para calcular totais antes de salvar
ExercicioSchema.pre("save", function (next) {
  this.totalAtivos = this.ativos.reduce(
    (sum, item) => sum + (item.valor || 0),
    0,
  );
  this.totalPassivos = this.passivos.reduce(
    (sum, item) => sum + (item.valor || 0),
    0,
  );
  this.variacaoMensal = this.totalAtivos - this.totalPassivos;
  next();
});

module.exports = mongoose.model("Exercicio", ExercicioSchema);
