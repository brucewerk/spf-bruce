const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listarContas,
  criarConta,
  updateConta,
  deleteConta,
} = require("../controllers/contaController");

router.use(auth);

router.get("/", listarContas);
router.post("/", criarConta);
router.put("/:id", updateConta);
router.delete("/:id", deleteConta);

module.exports = router;
