const rateLimit = require("express-rate-limit");

// Limite mais rígido para rotas de autenticação (login/registro), onde
// força bruta e enumeração de e-mails são o principal risco.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // 20 tentativas por IP a cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

// Limite geral, mais permissivo, para o restante da API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em instantes." },
});

module.exports = { authLimiter, apiLimiter };
