const Investimento = require("../models/Investimento");

const listarInvestimentos = async (req, res) => {
  try {
    const investimentos = await Investimento.find({ userId: req.userId });
    res.json(investimentos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar investimentos: " + error.message });
  }
};

const criarInvestimento = async (req, res) => {
  try {
    const {
      tipo,
      produto,
      nome,
      emissao,
      vencimento,
      valorCompra,
      saldoBruto,
      rendimento,
      taxaAno,
      irIof,
    } = req.body;

    // Calcular anos
    let anos = 0;
    if (vencimento) {
      const diffTime = Math.abs(new Date(vencimento) - new Date(emissao));
      anos = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    }

    const novoInvestimento = new Investimento({
      userId: req.userId,
      tipo,
      produto,
      nome,
      emissao: new Date(emissao),
      vencimento: vencimento ? new Date(vencimento) : null,
      anos,
      valorCompra: valorCompra || 0,
      saldoBruto: saldoBruto || 0,
      rendimento: rendimento || saldoBruto - valorCompra,
      taxaAno: taxaAno || 0,
      irIof: irIof || 0,
    });

    await novoInvestimento.save();
    res.status(201).json(novoInvestimento);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar investimento: " + error.message });
  }
};

const updateInvestimento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const investimento = await Investimento.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!investimento) {
      return res.status(404).json({ error: "Investimento não encontrado." });
    }

    // Recalcular anos se emissão ou vencimento mudarem
    if (updates.emissao || updates.vencimento) {
      const emissao = updates.emissao
        ? new Date(updates.emissao)
        : investimento.emissao;
      const vencimento = updates.vencimento
        ? new Date(updates.vencimento)
        : investimento.vencimento;
      if (vencimento) {
        const diffTime = Math.abs(vencimento - emissao);
        updates.anos = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
      }
    }

    Object.assign(investimento, updates);

    // Recalcular rendimento
    investimento.rendimento =
      investimento.saldoBruto - investimento.valorCompra;

    await investimento.save();

    res.json(investimento);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar investimento: " + error.message });
  }
};

const deleteInvestimento = async (req, res) => {
  try {
    const { id } = req.params;
    const investimento = await Investimento.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!investimento) {
      return res.status(404).json({ error: "Investimento não encontrado." });
    }

    res.json({ message: "Investimento deletado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar investimento: " + error.message });
  }
};

module.exports = {
  listarInvestimentos,
  criarInvestimento,
  updateInvestimento,
  deleteInvestimento,
};
