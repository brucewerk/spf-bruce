const Conta = require("../models/Conta");

const listarContas = async (req, res) => {
  try {
    const contas = await Conta.find({ userId: req.userId });
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar contas: " + error.message });
  }
};

const criarConta = async (req, res) => {
  try {
    const { nome, banco, agencia, conta, chavePix, tipo, saldoAtual } =
      req.body;

    const novaConta = new Conta({
      userId: req.userId,
      nome,
      banco,
      agencia,
      conta,
      chavePix: chavePix || "",
      tipo: tipo || "corrente",
      saldoAtual: saldoAtual || 0,
    });

    await novaConta.save();
    res.status(201).json(novaConta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar conta: " + error.message });
  }
};

const updateConta = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const conta = await Conta.findOne({ _id: id, userId: req.userId });
    if (!conta) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    Object.assign(conta, updates);
    await conta.save();

    res.json(conta);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar conta: " + error.message });
  }
};

const deleteConta = async (req, res) => {
  try {
    const { id } = req.params;
    const conta = await Conta.findOneAndDelete({ _id: id, userId: req.userId });

    if (!conta) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    res.json({ message: "Conta deletada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar conta: " + error.message });
  }
};

module.exports = {
  listarContas,
  criarConta,
  updateConta,
  deleteConta,
};
