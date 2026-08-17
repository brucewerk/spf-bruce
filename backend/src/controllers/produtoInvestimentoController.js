const ProdutoInvestimento = require("../models/ProdutoInvestimento");

// Listar todos os produtos de investimento
const listarProdutosInvestimento = async (req, res) => {
  try {
    const produtos = await ProdutoInvestimento.find({
      userId: req.userId,
    }).sort("ordem");
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos de investimento:", error);
    res.status(500).json({
      error: "Erro ao listar produtos de investimento: " + error.message,
    });
  }
};

// Listar produtos por tipo
const listarProdutosPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const produtos = await ProdutoInvestimento.find({
      userId: req.userId,
      tipo: tipo,
      ativo: true,
    }).sort("ordem");
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos por tipo:", error);
    res.status(500).json({
      error: "Erro ao listar produtos por tipo: " + error.message,
    });
  }
};

// Criar produto de investimento
const criarProdutoInvestimento = async (req, res) => {
  try {
    const { nome, tipo, cor, icone, ativo, ordem } = req.body;

    // Verificar se já existe
    const exists = await ProdutoInvestimento.findOne({
      userId: req.userId,
      nome: nome.trim(),
      tipo: tipo.trim(),
    });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Produto já existe para este tipo." });
    }

    const produto = new ProdutoInvestimento({
      userId: req.userId,
      nome: nome.trim(),
      tipo: tipo.trim(),
      cor: cor || "#8b5cf6",
      icone: icone || "📈",
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await produto.save();
    res.status(201).json(produto);
  } catch (error) {
    console.error("Erro ao criar produto de investimento:", error);
    res.status(500).json({
      error: "Erro ao criar produto de investimento: " + error.message,
    });
  }
};

// Atualizar produto de investimento
const updateProdutoInvestimento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const produto = await ProdutoInvestimento.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!produto) {
      return res
        .status(404)
        .json({ error: "Produto de investimento não encontrado." });
    }

    Object.assign(produto, updates);
    await produto.save();

    res.json(produto);
  } catch (error) {
    console.error("Erro ao atualizar produto de investimento:", error);
    res.status(500).json({
      error: "Erro ao atualizar produto de investimento: " + error.message,
    });
  }
};

// Deletar produto de investimento
const deleteProdutoInvestimento = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await ProdutoInvestimento.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!produto) {
      return res
        .status(404)
        .json({ error: "Produto de investimento não encontrado." });
    }

    res.json({ message: "Produto de investimento deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar produto de investimento:", error);
    res.status(500).json({
      error: "Erro ao deletar produto de investimento: " + error.message,
    });
  }
};

module.exports = {
  listarProdutosInvestimento,
  listarProdutosPorTipo,
  criarProdutoInvestimento,
  updateProdutoInvestimento,
  deleteProdutoInvestimento,
};
