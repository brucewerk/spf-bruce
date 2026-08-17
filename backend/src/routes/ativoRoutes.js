const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarAtivos,
  criarAtivo,
  updateAtivo,
  deleteAtivo,
} = require("../controllers/ativoController");

// Todas as rotas requerem autenticação
router.use(auth);

router.get("/", listarAtivos);
router.post("/", criarAtivo);
router.put("/:id", updateAtivo);
router.delete("/:id", deleteAtivo);

module.exports = router;
