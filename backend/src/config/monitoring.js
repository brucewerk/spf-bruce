const Sentry = require("@sentry/node");

// Antes, erros em produção só iam pro console.error do Vercel — que
// "some" nos logs depois de um tempo e não avisa ninguém. Isso pluga o
// Sentry (rastreamento de erros), mas só ativa de verdade se SENTRY_DSN
// estiver configurado. Sem essa variável, tudo funciona igual a antes —
// captureException vira um no-op silencioso, e captureException(err)
// pode ser chamado em qualquer lugar sem checar "se o Sentry existe".
let enabled = false;

const init = () => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log(
      "ℹ️  SENTRY_DSN não configurado — rastreamento de erros desativado.",
    );
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
  enabled = true;
  console.log("✅ Sentry inicializado.");
};

const captureException = (error, context = {}) => {
  if (enabled) {
    Sentry.captureException(error, { extra: context });
  }
};

module.exports = { init, captureException };
