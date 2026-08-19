import * as Sentry from "@sentry/react";

// Mesmo princípio do backend: sem VITE_SENTRY_DSN configurado no ambiente
// de build, isso não faz nada — o app funciona normalmente, só sem enviar
// erros pra lugar nenhum.
let enabled = false;

export const initMonitoring = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });
  enabled = true;
};

export const captureException = (error, context = {}) => {
  if (enabled) {
    Sentry.captureException(error, { extra: context });
  }
};
