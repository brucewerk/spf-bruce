const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarInvestimentos,
  criarInvestimento,
  updateInvestimento,
  deleteInvestimento,
} = require("../controllers/investimentoController");

router.use(auth);

router.get("/", listarInvestimentos);
router.post("/", criarInvestimento);
router.put("/:id", updateInvestimento);
router.delete("/:id", deleteInvestimento);

module.exports = router;
