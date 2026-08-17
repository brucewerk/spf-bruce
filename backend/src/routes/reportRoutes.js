const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  gerarRelatorioPDF,
  gerarRelatorioExcel,
  getAnalisesAvancadas,
  getNotificacoes,
  marcarNotificacaoLida,
} = require("../controllers/reportController");

// Todas as rotas requerem autenticação
router.use(auth);

// Relatórios
router.get("/pdf", gerarRelatorioPDF);
router.get("/excel", gerarRelatorioExcel);

// Análises
router.get("/analises", getAnalisesAvancadas);

// Notificações
router.get("/notificacoes", getNotificacoes);
router.put("/notificacoes/:id", marcarNotificacaoLida);

module.exports = router;
