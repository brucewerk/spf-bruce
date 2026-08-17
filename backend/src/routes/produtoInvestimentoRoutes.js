const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarProdutosInvestimento,
  listarProdutosPorTipo,
  criarProdutoInvestimento,
  updateProdutoInvestimento,
  deleteProdutoInvestimento,
} = require("../controllers/produtoInvestimentoController");

// Todas as rotas requerem autenticação
router.use(auth);

router.get("/", listarProdutosInvestimento);
router.get("/tipo/:tipo", listarProdutosPorTipo);
router.post("/", criarProdutoInvestimento);
router.put("/:id", updateProdutoInvestimento);
router.delete("/:id", deleteProdutoInvestimento);

module.exports = router;
