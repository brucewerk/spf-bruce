const CategoriaAtivo = require("../models/CategoriaAtivo");
const CategoriaPassivo = require("../models/CategoriaPassivo");

// ===== CATEGORIAS DE ATIVOS =====

// Listar todas as categorias de ativos
const listarCategoriasAtivo = async (req, res) => {
  try {
    const categorias = await CategoriaAtivo.find({ userId: req.userId }).sort(
      "ordem",
    );
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao listar categorias de ativos:", error);
    res
      .status(500)
      .json({ error: "Erro ao listar categorias de ativos: " + error.message });
  }
};

// Criar categoria de ativo
const criarCategoriaAtivo = async (req, res) => {
  try {
    const { nome, cor, icone, ativo, ordem } = req.body;

    // Verificar se já existe para este usuário
    const exists = await CategoriaAtivo.findOne({
      userId: req.userId,
      nome: nome.trim(),
    });
    if (exists) {
      return res.status(400).json({
        error: `A categoria "${nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }

    const categoria = new CategoriaAtivo({
      userId: req.userId,
      nome: nome.trim(),
      cor: cor || "#3b82f6",
      icone: icone || "🏦",
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    console.error("Erro ao criar categoria de ativo:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: `A categoria "${req.body.nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar categoria de ativo: " + error.message });
  }
};

// Atualizar categoria de ativo
const updateCategoriaAtivo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const categoria = await CategoriaAtivo.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    // Verificar se o novo nome já existe para este usuário
    if (updates.nome && updates.nome !== categoria.nome) {
      const exists = await CategoriaAtivo.findOne({
        userId: req.userId,
        nome: updates.nome.trim(),
      });
      if (exists) {
        return res.status(400).json({
          error: `A categoria "${updates.nome}" já existe para este usuário.`,
          code: "DUPLICATE",
        });
      }
    }

    Object.assign(categoria, updates);
    await categoria.save();

    res.json(categoria);
  } catch (error) {
    console.error("Erro ao atualizar categoria de ativo:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: `A categoria "${req.body.nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }
    res
      .status(500)
      .json({
        error: "Erro ao atualizar categoria de ativo: " + error.message,
      });
  }
};

// Deletar categoria de ativo
const deleteCategoriaAtivo = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaAtivo.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    res.json({ message: "Categoria deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar categoria de ativo:", error);
    res
      .status(500)
      .json({ error: "Erro ao deletar categoria de ativo: " + error.message });
  }
};

// ===== CATEGORIAS DE PASSIVOS =====

// Listar todas as categorias de passivos
const listarCategoriasPassivo = async (req, res) => {
  try {
    const categorias = await CategoriaPassivo.find({ userId: req.userId }).sort(
      "ordem",
    );
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao listar categorias de passivos:", error);
    res
      .status(500)
      .json({
        error: "Erro ao listar categorias de passivos: " + error.message,
      });
  }
};

// Criar categoria de passivo
const criarCategoriaPassivo = async (req, res) => {
  try {
    const { nome, cor, icone, ativo, ordem } = req.body;

    // Verificar se já existe para este usuário
    const exists = await CategoriaPassivo.findOne({
      userId: req.userId,
      nome: nome.trim(),
    });
    if (exists) {
      return res.status(400).json({
        error: `A categoria "${nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }

    const categoria = new CategoriaPassivo({
      userId: req.userId,
      nome: nome.trim(),
      cor: cor || "#ef4444",
      icone: icone || "💳",
      ativo: ativo !== undefined ? ativo : true,
      ordem: ordem || 0,
    });

    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    console.error("Erro ao criar categoria de passivo:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: `A categoria "${req.body.nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar categoria de passivo: " + error.message });
  }
};

// Atualizar categoria de passivo
const updateCategoriaPassivo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const categoria = await CategoriaPassivo.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    // Verificar se o novo nome já existe para este usuário
    if (updates.nome && updates.nome !== categoria.nome) {
      const exists = await CategoriaPassivo.findOne({
        userId: req.userId,
        nome: updates.nome.trim(),
      });
      if (exists) {
        return res.status(400).json({
          error: `A categoria "${updates.nome}" já existe para este usuário.`,
          code: "DUPLICATE",
        });
      }
    }

    Object.assign(categoria, updates);
    await categoria.save();

    res.json(categoria);
  } catch (error) {
    console.error("Erro ao atualizar categoria de passivo:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: `A categoria "${req.body.nome}" já existe para este usuário.`,
        code: "DUPLICATE",
      });
    }
    res
      .status(500)
      .json({
        error: "Erro ao atualizar categoria de passivo: " + error.message,
      });
  }
};

// Deletar categoria de passivo
const deleteCategoriaPassivo = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaPassivo.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    res.json({ message: "Categoria deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar categoria de passivo:", error);
    res
      .status(500)
      .json({
        error: "Erro ao deletar categoria de passivo: " + error.message,
      });
  }
};

module.exports = {
  listarCategoriasAtivo,
  criarCategoriaAtivo,
  updateCategoriaAtivo,
  deleteCategoriaAtivo,
  listarCategoriasPassivo,
  criarCategoriaPassivo,
  updateCategoriaPassivo,
  deleteCategoriaPassivo,
};
