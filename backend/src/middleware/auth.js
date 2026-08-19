const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new Error();
    }

    // Se o usuário deu logout (ou trocou a senha) depois que este token foi
    // emitido, tokenVersion já foi incrementado no banco e o token antigo
    // deixa de ser aceito, mesmo ainda não tendo expirado.
    if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      throw new Error();
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Não autorizado. Faça login novamente." });
  }
};

module.exports = auth;
