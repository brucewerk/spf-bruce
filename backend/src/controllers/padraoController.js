const AtivoPadrao = require("../models/AtivoPadrao");
const PassivoPadrao = require("../models/PassivoPadrao");

// ===== ATIVOS PADRÃO =====
const listarAtivosPadrao = async (req, res) => {
  try {
    const ativos = await AtivoPadrao.find({ userId: req.userId }).sort("ordem");
    res.json(ativos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar ativos padrão: " + error.message });
  }
};

const criarAtivoPadrao = async (req, res) => {
  try {
    const { nome, tipo, valorBase, ativo, ordem } = req.body;

    const novoAtivo = new AtivoPadrao({
      userId: req.userId,
      nome,
      tipo: tipo || "outro",
      valorBase: valorBase || 0,
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await novoAtivo.save();
    res.status(201).json(novoAtivo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar ativo padrão: " + error.message });
  }
};

const updateAtivoPadrao = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ativo = await AtivoPadrao.findOne({ _id: id, userId: req.userId });
    if (!ativo) {
      return res.status(404).json({ error: "Ativo padrão não encontrado." });
    }

    Object.assign(ativo, updates);
    await ativo.save();

    res.json(ativo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar ativo padrão: " + error.message });
  }
};

const deleteAtivoPadrao = async (req, res) => {
  try {
    const { id } = req.params;
    const ativo = await AtivoPadrao.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!ativo) {
      return res.status(404).json({ error: "Ativo padrão não encontrado." });
    }

    res.json({ message: "Ativo padrão deletado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar ativo padrão: " + error.message });
  }
};

// ===== PASSIVOS PADRÃO =====
const listarPassivosPadrao = async (req, res) => {
  try {
    const passivos = await PassivoPadrao.find({ userId: req.userId }).sort(
      "ordem",
    );
    res.json(passivos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar passivos padrão: " + error.message });
  }
};

const criarPassivoPadrao = async (req, res) => {
  try {
    const { nome, categoria, valorBase, ativo, ordem } = req.body;

    const novoPassivo = new PassivoPadrao({
      userId: req.userId,
      nome,
      categoria: categoria || "geral",
      valorBase: valorBase || 0,
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await novoPassivo.save();
    res.status(201).json(novoPassivo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar passivo padrão: " + error.message });
  }
};

const updatePassivoPadrao = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const passivo = await PassivoPadrao.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!passivo) {
      return res.status(404).json({ error: "Passivo padrão não encontrado." });
    }

    Object.assign(passivo, updates);
    await passivo.save();

    res.json(passivo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar passivo padrão: " + error.message });
  }
};

const deletePassivoPadrao = async (req, res) => {
  try {
    const { id } = req.params;
    const passivo = await PassivoPadrao.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!passivo) {
      return res.status(404).json({ error: "Passivo padrão não encontrado." });
    }

    res.json({ message: "Passivo padrão deletado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar passivo padrão: " + error.message });
  }
};

module.exports = {
  listarAtivosPadrao,
  criarAtivoPadrao,
  updateAtivoPadrao,
  deleteAtivoPadrao,
  listarPassivosPadrao,
  criarPassivoPadrao,
  updatePassivoPadrao,
  deletePassivoPadrao,
};
