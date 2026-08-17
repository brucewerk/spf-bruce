const Passivo = require("../models/Passivo");

// Listar todos os passivos do usuário
const listarPassivos = async (req, res) => {
  try {
    const passivos = await Passivo.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(passivos);
  } catch (error) {
    console.error("Erro ao listar passivos:", error);
    res
      .status(500)
      .json({ error: "Erro ao listar passivos: " + error.message });
  }
};

// Criar um novo passivo
const criarPassivo = async (req, res) => {
  try {
    const { nome, categoria, valor, dataVencimento, pago } = req.body;

    const novoPassivo = new Passivo({
      userId: req.userId,
      nome,
      categoria: categoria || "geral",
      valor: valor || 0,
      dataVencimento: dataVencimento || null,
      pago: pago || false,
    });

    await novoPassivo.save();
    res.status(201).json(novoPassivo);
  } catch (error) {
    console.error("Erro ao criar passivo:", error);
    res.status(500).json({ error: "Erro ao criar passivo: " + error.message });
  }
};

// Atualizar um passivo
const updatePassivo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const passivo = await Passivo.findOne({ _id: id, userId: req.userId });
    if (!passivo) {
      return res.status(404).json({ error: "Passivo não encontrado." });
    }

    Object.assign(passivo, updates);
    await passivo.save();

    res.json(passivo);
  } catch (error) {
    console.error("Erro ao atualizar passivo:", error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar passivo: " + error.message });
  }
};

// Deletar um passivo
const deletePassivo = async (req, res) => {
  try {
    const { id } = req.params;
    const passivo = await Passivo.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!passivo) {
      return res.status(404).json({ error: "Passivo não encontrado." });
    }

    res.json({ message: "Passivo deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar passivo:", error);
    res
      .status(500)
      .json({ error: "Erro ao deletar passivo: " + error.message });
  }
};

module.exports = {
  listarPassivos,
  criarPassivo,
  updatePassivo,
  deletePassivo,
};
