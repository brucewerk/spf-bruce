const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarPassivos,
  criarPassivo,
  updatePassivo,
  deletePassivo,
} = require("../controllers/passivoController");

// Todas as rotas requerem autenticação
router.use(auth);

router.get("/", listarPassivos);
router.post("/", criarPassivo);
router.put("/:id", updatePassivo);
router.delete("/:id", deletePassivo);

module.exports = router;
