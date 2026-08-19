const Exercicio = require("../models/Exercicio");
const AtivoPadrao = require("../models/AtivoPadrao");
const PassivoPadrao = require("../models/PassivoPadrao");
const InvestimentoPadrao = require("../models/InvestimentoPadrao");
const Conta = require("../models/Conta");
const mongoose = require("mongoose");

// Atualizar saldo das contas baseado nos exercícios
const atualizarSaldosContas = async (userId) => {
  try {
    const exercicios = await Exercicio.find({ userId }).sort({
      year: 1,
      month: 1,
    });
    const contas = await Conta.find({ userId });

    for (const conta of contas) {
      let saldoAcumulado = conta.saldoAtual || 0;

      for (const exercicio of exercicios) {
        const ativoConta = exercicio.ativos.find(
          (a) =>
            a.nome.toLowerCase().includes(conta.nome.toLowerCase()) ||
            conta.nome.toLowerCase().includes(a.nome.toLowerCase()),
        );

        if (ativoConta) {
          saldoAcumulado = ativoConta.valor || 0;
        }
      }

      await Conta.findByIdAndUpdate(conta._id, { saldoAtual: saldoAcumulado });
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar saldos das contas:", error);
    return { success: false, error: error.message };
  }
};

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

    // Buscar ativos, passivos e INVESTIMENTOS padrão
    const ativosPadrao = await AtivoPadrao.find({ userId, ativo: true }).sort(
      "ordem",
    );
    const passivosPadrao = await PassivoPadrao.find({
      userId,
      ativo: true,
    }).sort("ordem");
    const investimentosPadrao = await InvestimentoPadrao.find({
      userId,
      ativo: true,
    }).sort("ordem");

    // Criar exercício com os dados dos padrões
    const exercicio = new Exercicio({
      userId,
      year,
      month,
      ativos: ativosPadrao.map((a) => ({
        nome: a.nome,
        tipo: a.tipo || "outro",
        valor: a.valorBase || 0,
        ordem: a.ordem || 0,
      })),
      passivos: passivosPadrao.map((p) => ({
        nome: p.nome,
        categoria: p.categoria || "geral",
        valor: p.valorBase || 0,
        ordem: p.ordem || 0,
      })),
      investimentos: investimentosPadrao.map((i) => ({
        tipo: i.tipo,
        produto: i.produto,
        nome: i.nome,
        emissao: i.emissao,
        vencimento: i.vencimento,
        anos: i.anos,
        valorCompra: i.valorCompra || 0,
        saldoBruto: i.saldoBruto || 0,
        rendimento: (i.saldoBruto || 0) - (i.valorCompra || 0),
        taxaAno: i.taxaAno || 0,
        irIof: i.irIof || 0,
        ordem: i.ordem || 0,
      })),
    });

    // Calcular totais
    exercicio.totalAtivos = exercicio.ativos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    exercicio.totalPassivos = exercicio.passivos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    exercicio.variacaoMensal = exercicio.totalAtivos - exercicio.totalPassivos;

    await exercicio.save();

    // Atualizar saldos das contas
    await atualizarSaldosContas(userId);

    // Retornar o exercício completo com os dados
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

    const filter = { userId };
    if (year) filter.year = parseInt(year);

    // Telas como a lista de exercícios só precisam de totais e contagem de
    // itens, não dos arrays completos de ativos/passivos/investimentos de
    // cada mês. Com `resumo=true`, evitamos trafegar esses arrays inteiros
    // pela rede — isso cresce a cada mês que o usuário usa o app.
    if (resumo === "true") {
      const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
      if (year) matchStage.year = parseInt(year);

      const exercicios = await Exercicio.aggregate([
        { $match: matchStage },
        { $sort: { year: -1, month: -1 } },
        {
          $project: {
            year: 1,
            month: 1,
            totalAtivos: 1,
            totalPassivos: 1,
            variacaoMensal: 1,
            qtdAtivos: { $size: { $ifNull: ["$ativos", []] } },
            qtdPassivos: { $size: { $ifNull: ["$passivos", []] } },
            qtdInvestimentos: { $size: { $ifNull: ["$investimentos", []] } },
          },
        },
      ]);
      return res.json(exercicios);
    }

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

    // Recalcular totais
    exercicio.totalAtivos = exercicio.ativos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    exercicio.totalPassivos = exercicio.passivos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    exercicio.variacaoMensal = exercicio.totalAtivos - exercicio.totalPassivos;

    await exercicio.save();

    // Atualizar saldos das contas
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

    // Atualizar saldos das contas
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

    // Buscar mês anterior
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

    // Copiar valores (INCLUINDO INVESTIMENTOS)
    exercicio.ativos = prevExercicio.ativos.map((a) => ({
      nome: a.nome,
      tipo: a.tipo || "outro",
      valor: a.valor || 0,
      ordem: a.ordem || 0,
    }));
    exercicio.passivos = prevExercicio.passivos.map((p) => ({
      nome: p.nome,
      categoria: p.categoria || "geral",
      valor: p.valor || 0,
      ordem: p.ordem || 0,
    }));
    exercicio.investimentos = prevExercicio.investimentos.map((i) => ({
      tipo: i.tipo,
      produto: i.produto,
      nome: i.nome,
      emissao: i.emissao,
      vencimento: i.vencimento,
      anos: i.anos,
      valorCompra: i.valorCompra || 0,
      saldoBruto: i.saldoBruto || 0,
      rendimento: (i.saldoBruto || 0) - (i.valorCompra || 0),
      taxaAno: i.taxaAno || 0,
      irIof: i.irIof || 0,
      ordem: i.ordem || 0,
    }));

    // Recalcular totais
    exercicio.totalAtivos = exercicio.ativos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    exercicio.totalPassivos = exercicio.passivos.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    exercicio.variacaoMensal = exercicio.totalAtivos - exercicio.totalPassivos;

    await exercicio.save();

    // Atualizar saldos das contas
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
