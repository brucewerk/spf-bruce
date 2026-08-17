const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarTiposInvestimento,
  criarTipoInvestimento,
  updateTipoInvestimento,
  deleteTipoInvestimento,
} = require("../controllers/tipoInvestimentoController");

// Todas as rotas requerem autenticação
router.use(auth);

router.get("/", listarTiposInvestimento);
router.post("/", criarTipoInvestimento);
router.put("/:id", updateTipoInvestimento);
router.delete("/:id", deleteTipoInvestimento);

module.exports = router;
