const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarAtivosPadrao,
  criarAtivoPadrao,
  updateAtivoPadrao,
  deleteAtivoPadrao,
  listarPassivosPadrao,
  criarPassivoPadrao,
  updatePassivoPadrao,
  deletePassivoPadrao,
} = require("../controllers/padraoController");

const {
  listarInvestimentosPadrao,
  criarInvestimentoPadrao,
  updateInvestimentoPadrao,
  deleteInvestimentoPadrao,
} = require("../controllers/investimentoPadraoController");

router.use(auth);

// Ativos padrão
router.get("/ativos", listarAtivosPadrao);
router.post("/ativos", criarAtivoPadrao);
router.put("/ativos/:id", updateAtivoPadrao);
router.delete("/ativos/:id", deleteAtivoPadrao);

// Passivos padrão
router.get("/passivos", listarPassivosPadrao);
router.post("/passivos", criarPassivoPadrao);
router.put("/passivos/:id", updatePassivoPadrao);
router.delete("/passivos/:id", deletePassivoPadrao);

// Investimentos padrão
router.get("/investimentos", listarInvestimentosPadrao);
router.post("/investimentos", criarInvestimentoPadrao);
router.put("/investimentos/:id", updateInvestimentoPadrao);
router.delete("/investimentos/:id", deleteInvestimentoPadrao);

module.exports = router;
