const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validateZod = require("../middleware/validateZod");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");

// Rotas públicas — validação vem do schema Zod em src/schemas/authSchema.js,
// mantido em sincronia com a cópia do frontend por um teste de contrato
// (ver backend/tests/authSchema.contract.test.js). A regra de "senha com
// pelo menos 6 caracteres" e "e-mail válido" é a MESMA usada no formulário
// de cadastro no navegador. Antes disso, essas regras existiam duas vezes
// (express-validator aqui, e nada de verdade no frontend).
router.post("/register", validateZod("registerSchema"), register);
router.post("/login", validateZod("loginSchema"), login);

// Rotas protegidas
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteAccount);
router.post("/logout", auth, logout);

module.exports = router;
