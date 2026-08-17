const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  criarExercicio,
  listarExercicios,
  getExercicio,
  updateExercicio,
  deleteExercicio,
  copiarMesAnterior,
  importarExcel,
} = require("../controllers/exercicioController");

router.use(auth);

router.post("/", criarExercicio);
router.get("/", listarExercicios);
router.get("/:id", getExercicio);
router.put("/:id", updateExercicio);
router.delete("/:id", deleteExercicio);
router.post("/:id/copiar", copiarMesAnterior);
router.post("/importar", importarExcel);

module.exports = router;
