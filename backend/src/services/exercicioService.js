const mongoose = require("mongoose");
const Exercicio = require("../models/Exercicio");
const AtivoPadrao = require("../models/AtivoPadrao");
const PassivoPadrao = require("../models/PassivoPadrao");
const InvestimentoPadrao = require("../models/InvestimentoPadrao");
const Conta = require("../models/Conta");

// Antes essa lógica (cálculo de totais, mapeamento de padrões, atualização
// de saldo) estava duplicada dentro de criarExercicio/updateExercicio/
// copiarMesAnterior no controller, misturada com req/res — o que torna
// impossível testar sem simular uma requisição HTTP inteira. Aqui ela vira
// funções puras (fáceis de testar isoladas) e funções de acesso a dados
// (fáceis de mockar), e o controller só orquestra: recebe req, chama o
// serviço, devolve res.

// --- Cálculo de totais ---
// Função pura: mesma entrada sempre produz a mesma saída, sem tocar em
// banco de dados nem em req/res. É o coração do "livro-caixa" do app —
// usada em criar, atualizar e copiar do mês anterior.
const calcularTotais = ({ ativos = [], passivos = [] }) => {
  const totalAtivos = ativos.reduce((sum, item) => sum + (item.valor || 0), 0);
  const totalPassivos = passivos.reduce(
    (sum, item) => sum + (item.valor || 0),
    0,
  );
  return {
    totalAtivos,
    totalPassivos,
    variacaoMensal: totalAtivos - totalPassivos,
  };
};

// --- Mapeamento: padrão cadastrado -> item de um exercício novo ---
const ativoDoPadrao = (a) => ({
  nome: a.nome,
  tipo: a.tipo || "outro",
  valor: a.valorBase || 0,
  ordem: a.ordem || 0,
});

const passivoDoPadrao = (p) => ({
  nome: p.nome,
  categoria: p.categoria || "geral",
  valor: p.valorBase || 0,
  ordem: p.ordem || 0,
});

const investimentoDoPadrao = (i) => ({
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
});

// --- Mapeamento: item de um exercício anterior -> item copiado ---
const ativoDoExercicioAnterior = (a) => ({
  nome: a.nome,
  tipo: a.tipo || "outro",
  valor: a.valor || 0,
  ordem: a.ordem || 0,
});

const passivoDoExercicioAnterior = (p) => ({
  nome: p.nome,
  categoria: p.categoria || "geral",
  valor: p.valor || 0,
  ordem: p.ordem || 0,
});

const investimentoDoExercicioAnterior = (i) => ({
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
});

// --- Acesso a dados: montar os arrays de um exercício novo a partir dos
// padrões cadastrados pelo usuário ---
const montarItensDePadroes = async (userId) => {
  const [ativosPadrao, passivosPadrao, investimentosPadrao] =
    await Promise.all([
      AtivoPadrao.find({ userId, ativo: true }).sort("ordem"),
      PassivoPadrao.find({ userId, ativo: true }).sort("ordem"),
      InvestimentoPadrao.find({ userId, ativo: true }).sort("ordem"),
    ]);

  return {
    ativos: ativosPadrao.map(ativoDoPadrao),
    passivos: passivosPadrao.map(passivoDoPadrao),
    investimentos: investimentosPadrao.map(investimentoDoPadrao),
  };
};

// --- Acesso a dados: copiar os arrays de um exercício anterior ---
const montarItensDeExercicioAnterior = (exercicioAnterior) => ({
  ativos: exercicioAnterior.ativos.map(ativoDoExercicioAnterior),
  passivos: exercicioAnterior.passivos.map(passivoDoExercicioAnterior),
  investimentos: exercicioAnterior.investimentos.map(
    investimentoDoExercicioAnterior,
  ),
});

// --- Atualizar saldo das contas com base no histórico de exercícios ---
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

// --- Listagem resumida (usada por GET /exercicios?resumo=true) ---
const listarResumo = async (userId, year) => {
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
  if (year) matchStage.year = parseInt(year);

  return Exercicio.aggregate([
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
};

module.exports = {
  calcularTotais,
  montarItensDePadroes,
  montarItensDeExercicioAnterior,
  atualizarSaldosContas,
  listarResumo,
};
