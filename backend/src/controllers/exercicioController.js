const Exercicio = require("../models/Exercicio");
const {
  calcularTotais,
  montarItensDePadroes,
  montarItensDeExercicioAnterior,
  atualizarSaldosContas,
  listarResumo,
} = require("../services/exercicioService");

// Criar novo exercício
const criarExercicio = async (req, res) => {
  try {
    const { year, month } = req.body;
    const userId = req.userId;

    // Verificar se já existe
    const exists = await Exercicio.findOne({ userId, year, month });
    if (exists) {
      return res.status(400).json({ error: "Este mês/ano já foi criado." });
    }

    const itens = await montarItensDePadroes(userId);
    const exercicio = new Exercicio({ userId, year, month, ...itens });

    Object.assign(exercicio, calcularTotais(exercicio));

    await exercicio.save();
    await atualizarSaldosContas(userId);

    res.status(201).json({
      success: true,
      message: "Exercício criado com sucesso!",
      exercicio,
    });
  } catch (error) {
    console.error("Erro ao criar exercício:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar exercício: " + error.message });
  }
};

// Listar exercícios por ano
const listarExercicios = async (req, res) => {
  try {
    const { year, resumo } = req.query;
    const userId = req.userId;

    // Telas como a lista de exercícios só precisam de totais e contagem de
    // itens, não dos arrays completos de ativos/passivos/investimentos de
    // cada mês. Com `resumo=true`, evitamos trafegar esses arrays inteiros
    // pela rede — isso cresce a cada mês que o usuário usa o app.
    if (resumo === "true") {
      const exercicios = await listarResumo(userId, year);
      return res.json(exercicios);
    }

    const filter = { userId };
    if (year) filter.year = parseInt(year);

    const exercicios = await Exercicio.find(filter).sort({
      year: -1,
      month: -1,
    });
    res.json(exercicios);
  } catch (error) {
    console.error("Erro ao listar exercícios:", error);
    res
      .status(500)
      .json({ error: "Erro ao listar exercícios: " + error.message });
  }
};

// Buscar um exercício específico
const getExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const exercicio = await Exercicio.findOne({ _id: id, userId: req.userId });

    if (!exercicio) {
      return res.status(404).json({ error: "Exercício não encontrado." });
    }

    res.json(exercicio);
  } catch (error) {
    console.error("Erro ao buscar exercício:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar exercício: " + error.message });
  }
};

// Atualizar exercício
const updateExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { ativos, passivos, investimentos } = req.body;

    const exercicio = await Exercicio.findOne({ _id: id, userId: req.userId });
    if (!exercicio) {
      return res.status(404).json({ error: "Exercício não encontrado." });
    }

    if (ativos) exercicio.ativos = ativos;
    if (passivos) exercicio.passivos = passivos;
    if (investimentos) exercicio.investimentos = investimentos;

    Object.assign(exercicio, calcularTotais(exercicio));

    await exercicio.save();
    await atualizarSaldosContas(req.userId);

    res.json({
      success: true,
      message: "Exercício atualizado com sucesso!",
      exercicio,
    });
  } catch (error) {
    console.error("Erro ao atualizar exercício:", error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar exercício: " + error.message });
  }
};

// Deletar exercício
const deleteExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const exercicio = await Exercicio.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!exercicio) {
      return res.status(404).json({ error: "Exercício não encontrado." });
    }

    await atualizarSaldosContas(req.userId);

    res.json({ success: true, message: "Exercício deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar exercício:", error);
    res
      .status(500)
      .json({ error: "Erro ao deletar exercício: " + error.message });
  }
};

// Copiar do mês anterior
const copiarMesAnterior = async (req, res) => {
  try {
    const { id } = req.params;
    const exercicio = await Exercicio.findOne({ _id: id, userId: req.userId });

    if (!exercicio) {
      return res.status(404).json({ error: "Exercício não encontrado." });
    }

    let prevMonth = exercicio.month - 1;
    let prevYear = exercicio.year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear--;
    }

    const prevExercicio = await Exercicio.findOne({
      userId: req.userId,
      year: prevYear,
      month: prevMonth,
    });

    if (!prevExercicio) {
      return res.status(404).json({ error: "Mês anterior não encontrado." });
    }

    Object.assign(exercicio, montarItensDeExercicioAnterior(prevExercicio));
    Object.assign(exercicio, calcularTotais(exercicio));

    await exercicio.save();
    await atualizarSaldosContas(req.userId);

    res.json({
      success: true,
      message: "Valores copiados do mês anterior com sucesso.",
      exercicio,
    });
  } catch (error) {
    console.error("Erro ao copiar mês anterior:", error);
    res
      .status(500)
      .json({ error: "Erro ao copiar mês anterior: " + error.message });
  }
};

// Importar do Excel (placeholder)
const importarExcel = async (req, res) => {
  try {
    res.status(501).json({ error: "Funcionalidade em desenvolvimento." });
  } catch (error) {
    console.error("Erro ao importar Excel:", error);
    res.status(500).json({ error: "Erro ao importar Excel: " + error.message });
  }
};

module.exports = {
  criarExercicio,
  listarExercicios,
  getExercicio,
  updateExercicio,
  deleteExercicio,
  copiarMesAnterior,
  importarExcel,
};
