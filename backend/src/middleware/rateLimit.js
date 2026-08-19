const rateLimit = require("express-rate-limit");

// Em ambiente de teste, os testes de integração fazem várias chamadas de
// login/registro em sequência — sem isso, o próprio rate limiter começaria
// a barrar os testes depois de poucas requisições.
const skipInTest = () => process.env.NODE_ENV === "test";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

let authLimiter;
let apiLimiter;

if (hasUpstash) {
  // O backend roda em serverless no Vercel: cada requisição pode cair numa
  // instância diferente, então um limitador em memória local (como o
  // express-rate-limit puro, usado no fallback abaixo) não é confiável —
  // ele "esquece" as tentativas de um IP toda vez que troca de instância.
  // Com Upstash (Redis via REST, feito pra serverless/edge), o contador
  // fica compartilhado de verdade entre todas as instâncias.
  const { Redis } = require("@upstash/redis");
  const { Ratelimit } = require("@upstash/ratelimit");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const authRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "15 m"),
    prefix: "spf:ratelimit:auth",
  });
  const apiRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, "15 m"),
    prefix: "spf:ratelimit:api",
  });

  const toMiddleware = (limiter, message) => async (req, res, next) => {
    if (skipInTest()) return next();

    try {
      const { success, limit, remaining } = await limiter.limit(req.ip);
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);
      if (!success) {
        return res.status(429).json({ error: message });
      }
      next();
    } catch (error) {
      // Se o Upstash estiver fora do ar, não deixamos a API inteira cair
      // junto — deixamos a requisição passar e registramos o erro.
      console.error("❌ Erro no rate limit (Upstash):", error.message);
      next();
    }
  };

  authLimiter = toMiddleware(
    authRatelimit,
    "Muitas tentativas. Tente novamente em alguns minutos.",
  );
  apiLimiter = toMiddleware(
    apiRatelimit,
    "Muitas requisições. Tente novamente em instantes.",
  );

  console.log("✅ Rate limiting via Upstash Redis (persistente entre instâncias serverless).");
} else {
  console.log(
    "ℹ️  UPSTASH_REDIS_REST_URL não configurado — rate limiting em memória local " +
      "(ok para desenvolvimento; em produção serverless, cada instância tem seu " +
      "próprio contador — ver backend/.env.example para ativar o modo persistente).",
  );

  // Limite mais rígido para rotas de autenticação (login/registro), onde
  // força bruta e enumeração de e-mails são o principal risco.
  authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // 20 tentativas por IP a cada 15 min
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipInTest,
    message: {
      error: "Muitas tentativas. Tente novamente em alguns minutos.",
    },
  });

  // Limite geral, mais permissivo, para o restante da API.
  apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipInTest,
    message: { error: "Muitas requisições. Tente novamente em instantes." },
  });
}

module.exports = { authLimiter, apiLimiter };
