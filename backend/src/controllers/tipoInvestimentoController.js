const TipoInvestimento = require("../models/TipoInvestimento");

// Listar todos os tipos de investimento
const listarTiposInvestimento = async (req, res) => {
  try {
    const tipos = await TipoInvestimento.find({ userId: req.userId }).sort(
      "ordem",
    );
    res.json(tipos);
  } catch (error) {
    console.error("Erro ao listar tipos de investimento:", error);
    res.status(500).json({
      error: "Erro ao listar tipos de investimento: " + error.message,
    });
  }
};

// Criar tipo de investimento
const criarTipoInvestimento = async (req, res) => {
  try {
    const { nome, cor, icone, ativo, ordem } = req.body;

    // Verificar se já existe para este usuário
    const exists = await TipoInvestimento.findOne({
      userId: req.userId,
      nome: nome.trim(),
    });
    if (exists) {
      return res.status(400).json({
        error: `O tipo "${nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }

    const tipo = new TipoInvestimento({
      userId: req.userId,
      nome: nome.trim(),
      cor: cor || "#8b5cf6",
      icone: icone || "📈",
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await tipo.save();
    res.status(201).json(tipo);
  } catch (error) {
    console.error("Erro ao criar tipo de investimento:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: `O tipo "${req.body.nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }
    res.status(500).json({
      error: "Erro ao criar tipo de investimento: " + error.message,
    });
  }
};

// Atualizar tipo de investimento
const updateTipoInvestimento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tipo = await TipoInvestimento.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!tipo) {
      return res
        .status(404)
        .json({ error: "Tipo de investimento não encontrado." });
    }

    // Verificar se o novo nome já existe para este usuário
    if (updates.nome && updates.nome !== tipo.nome) {
      const exists = await TipoInvestimento.findOne({
        userId: req.userId,
        nome: updates.nome.trim(),
      });
      if (exists) {
        return res.status(400).json({
          error: `O tipo "${updates.nome}" já existe para este usuário.`,
          code: "DUPLICATE",
        });
      }
    }

    Object.assign(tipo, updates);
    await tipo.save();

    res.json(tipo);
  } catch (error) {
    console.error("Erro ao atualizar tipo de investimento:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: `O tipo "${req.body.nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }
    res.status(500).json({
      error: "Erro ao atualizar tipo de investimento: " + error.message,
    });
  }
};

// Deletar tipo de investimento
const deleteTipoInvestimento = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoInvestimento.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!tipo) {
      return res
        .status(404)
        .json({ error: "Tipo de investimento não encontrado." });
    }

    res.json({ message: "Tipo de investimento deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar tipo de investimento:", error);
    res.status(500).json({
      error: "Erro ao deletar tipo de investimento: " + error.message,
    });
  }
};

module.exports = {
  listarTiposInvestimento,
  criarTipoInvestimento,
  updateTipoInvestimento,
  deleteTipoInvestimento,
};
