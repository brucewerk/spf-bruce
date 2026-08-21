const schemas = require("../schemas/authSchema");

// Middleware de validação usando os schemas Zod do backend
// (src/schemas/authSchema.js — mantido em sincronia com a cópia do
// frontend por um teste de contrato, ver esse arquivo para detalhes).
const validateZod = (schemaName) => {
  const schema = schemas[schemaName];

  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const primeiroErro = result.error.issues[0];
      return res.status(400).json({
        error: primeiroErro.message,
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          msg: issue.message,
        })),
      });
    }

    // Substitui req.body pelos dados já normalizados pelo schema
    // (e-mail em minúsculas, strings sem espaço nas pontas, etc.) —
    // o controller passa a receber sempre o dado limpo.
    req.body = result.data;
    next();
  };
};

module.exports = validateZod;
