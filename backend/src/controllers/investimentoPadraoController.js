const InvestimentoPadrao = require("../models/InvestimentoPadrao");

// Listar todos os investimentos padrão
const listarInvestimentosPadrao = async (req, res) => {
  try {
    const investimentos = await InvestimentoPadrao.find({
      userId: req.userId,
    }).sort("ordem");
    res.json(investimentos);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar investimentos padrão: " + error.message,
    });
  }
};

// Criar investimento padrão
const criarInvestimentoPadrao = async (req, res) => {
  try {
    const {
      tipo,
      produto,
      nome,
      emissao,
      vencimento,
      valorCompra,
      saldoBruto,
      taxaAno,
      irIof,
      ativo,
      ordem,
    } = req.body;

    // Calcular anos
    let anos = 0;
    if (vencimento) {
      const diffTime = Math.abs(new Date(vencimento) - new Date(emissao));
      anos = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    }

    const investimento = new InvestimentoPadrao({
      userId: req.userId,
      tipo,
      produto,
      nome,
      emissao: new Date(emissao),
      vencimento: vencimento ? new Date(vencimento) : null,
      anos,
      valorCompra: valorCompra || 0,
      saldoBruto: saldoBruto || 0,
      rendimento: (saldoBruto || 0) - (valorCompra || 0),
      taxaAno: taxaAno || 0,
      irIof: irIof || 0,
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await investimento.save();
    res.status(201).json(investimento);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar investimento padrão: " + error.message,
    });
  }
};

// Atualizar investimento padrão
const updateInvestimentoPadrao = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const investimento = await InvestimentoPadrao.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!investimento) {
      return res
        .status(404)
        .json({ error: "Investimento padrão não encontrado." });
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

    // Recalcular rendimento
    if (updates.saldoBruto !== undefined || updates.valorCompra !== undefined) {
      const saldoBruto =
        updates.saldoBruto !== undefined
          ? updates.saldoBruto
          : investimento.saldoBruto;
      const valorCompra =
        updates.valorCompra !== undefined
          ? updates.valorCompra
          : investimento.valorCompra;
      updates.rendimento = saldoBruto - valorCompra;
    }

    Object.assign(investimento, updates);
    await investimento.save();

    res.json(investimento);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar investimento padrão: " + error.message,
    });
  }
};

// Deletar investimento padrão
const deleteInvestimentoPadrao = async (req, res) => {
  try {
    const { id } = req.params;
    const investimento = await InvestimentoPadrao.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!investimento) {
      return res
        .status(404)
        .json({ error: "Investimento padrão não encontrado." });
    }

    res.json({ message: "Investimento padrão deletado com sucesso." });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar investimento padrão: " + error.message,
    });
  }
};

module.exports = {
  listarInvestimentosPadrao,
  criarInvestimentoPadrao,
  updateInvestimentoPadrao,
  deleteInvestimentoPadrao,
};
