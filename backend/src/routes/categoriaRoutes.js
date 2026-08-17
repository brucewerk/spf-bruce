const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarCategoriasAtivo,
  criarCategoriaAtivo,
  updateCategoriaAtivo,
  deleteCategoriaAtivo,
  listarCategoriasPassivo,
  criarCategoriaPassivo,
  updateCategoriaPassivo,
  deleteCategoriaPassivo,
} = require("../controllers/categoriaController");

// Todas as rotas requerem autenticação
router.use(auth);

// Rotas para categorias de ativos
router.get("/ativos", listarCategoriasAtivo);
router.post("/ativos", criarCategoriaAtivo);
router.put("/ativos/:id", updateCategoriaAtivo);
router.delete("/ativos/:id", deleteCategoriaAtivo);

// Rotas para categorias de passivos
router.get("/passivos", listarCategoriasPassivo);
router.post("/passivos", criarCategoriaPassivo);
router.put("/passivos/:id", updateCategoriaPassivo);
router.delete("/passivos/:id", deleteCategoriaPassivo);

module.exports = router;
