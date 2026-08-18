const { validationResult } = require("express-validator");

// Verifica o resultado das regras do express-validator definidas na rota.
// Sem isso, os validators (isEmail, isLength, etc.) rodam mas nunca bloqueiam
// a requisição — o controller é chamado mesmo com dados inválidos.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
      details: errors.array(),
    });
  }
  next();
};

module.exports = validate;
