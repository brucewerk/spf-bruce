const Ativo = require("../models/Ativo");

// Listar todos os ativos do usuário
const listarAtivos = async (req, res) => {
  try {
    const ativos = await Ativo.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(ativos);
  } catch (error) {
    console.error("Erro ao listar ativos:", error);
    res.status(500).json({ error: "Erro ao listar ativos: " + error.message });
  }
};

// Criar um novo ativo
const criarAtivo = async (req, res) => {
  try {
    const { nome, tipo, valor, dataAquisicao, ativo } = req.body;

    const novoAtivo = new Ativo({
      userId: req.userId,
      nome,
      tipo: tipo || "outro",
      valor: valor || 0,
      dataAquisicao: dataAquisicao || null,
      ativo: ativo !== undefined ? ativo : true,
    });

    await novoAtivo.save();
    res.status(201).json(novoAtivo);
  } catch (error) {
    console.error("Erro ao criar ativo:", error);
    res.status(500).json({ error: "Erro ao criar ativo: " + error.message });
  }
};

// Atualizar um ativo
const updateAtivo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ativo = await Ativo.findOne({ _id: id, userId: req.userId });
    if (!ativo) {
      return res.status(404).json({ error: "Ativo não encontrado." });
    }

    Object.assign(ativo, updates);
    await ativo.save();

    res.json(ativo);
  } catch (error) {
    console.error("Erro ao atualizar ativo:", error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar ativo: " + error.message });
  }
};

// Deletar um ativo
const deleteAtivo = async (req, res) => {
  try {
    const { id } = req.params;
    const ativo = await Ativo.findOneAndDelete({ _id: id, userId: req.userId });

    if (!ativo) {
      return res.status(404).json({ error: "Ativo não encontrado." });
    }

    res.json({ message: "Ativo deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar ativo:", error);
    res.status(500).json({ error: "Erro ao deletar ativo: " + error.message });
  }
};

module.exports = {
  listarAtivos,
  criarAtivo,
  updateAtivo,
  deleteAtivo,
};
