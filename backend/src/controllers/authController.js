const User = require("../models/User");
const Ativo = require("../models/Ativo");
const AtivoPadrao = require("../models/AtivoPadrao");
const Passivo = require("../models/Passivo");
const PassivoPadrao = require("../models/PassivoPadrao");
const Investimento = require("../models/Investimento");
const InvestimentoPadrao = require("../models/InvestimentoPadrao");
const Conta = require("../models/Conta");
const Exercicio = require("../models/Exercicio");
const CategoriaAtivo = require("../models/CategoriaAtivo");
const CategoriaPassivo = require("../models/CategoriaPassivo");
const TipoInvestimento = require("../models/TipoInvestimento");
const ProdutoInvestimento = require("../models/ProdutoInvestimento");
const jwt = require("jsonwebtoken");

// Gerar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Registrar
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Verificar se usuário já existe
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    // Criar usuário
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      message: "Usuário criado com sucesso!",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao registrar usuário: " + error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    const token = generateToken(user._id);
    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login: " + error.message });
  }
};

// Buscar perfil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil: " + error.message });
  }
};

// Atualizar perfil
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar senha atual se for alterar senha
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Senha atual é obrigatória para alterar senha." });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Senha atual incorreta." });
      }
      user.password = newPassword;
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase();
    user.updatedAt = Date.now();

    await user.save();

    res.json({
      message: "Perfil atualizado com sucesso!",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar perfil: " + error.message });
  }
};

// Deletar conta
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Deletar todos os dados relacionados ao usuário antes de remover a conta
    const userId = user._id;
    await Promise.all([
      Ativo.deleteMany({ userId }),
      AtivoPadrao.deleteMany({ userId }),
      Passivo.deleteMany({ userId }),
      PassivoPadrao.deleteMany({ userId }),
      Investimento.deleteMany({ userId }),
      InvestimentoPadrao.deleteMany({ userId }),
      Conta.deleteMany({ userId }),
      Exercicio.deleteMany({ userId }),
      CategoriaAtivo.deleteMany({ userId }),
      CategoriaPassivo.deleteMany({ userId }),
      TipoInvestimento.deleteMany({ userId }),
      ProdutoInvestimento.deleteMany({ userId }),
    ]);

    await user.deleteOne();

    res.json({ message: "Conta deletada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar conta: " + error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
};
