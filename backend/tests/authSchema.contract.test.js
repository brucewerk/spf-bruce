// Backend e frontend têm cada um sua própria cópia de authSchema (ver o
// comentário em backend/src/schemas/authSchema.js para o porquê). Este
// teste é o que garante, na prática, que elas nunca fiquem dessincronizadas
// — roda a mesma bateria de casos nos dois schemas e falha se as respostas
// não baterem.
//
// A cópia do frontend é ESM; o Jest não consegue importá-la dinamicamente
// sem flags experimentais, então ela é avaliada num processo `node`
// separado (tests/helpers/runFrontendSchema.js) — ver esse arquivo para
// detalhes. Isso só é seguro em teste (CI/dev, onde backend e frontend
// sempre estão lado a lado no mesmo checkout); o código de produção nunca
// faz essa travessia entre pastas.
const path = require("path");
const { execFileSync } = require("child_process");
const backendSchemas = require("../src/schemas/authSchema");

const rodarSchemaDoFrontend = (schemaName, casos) => {
  const helperPath = path.join(__dirname, "helpers/runFrontendSchema.js");
  const saida = execFileSync("node", [helperPath, schemaName], {
    input: JSON.stringify(casos),
    encoding: "utf-8",
  });
  return JSON.parse(saida);
};

const casosRegister = [
  { name: "Bruno", email: "bruno@example.com", password: "senha123" },
  { name: "", email: "bruno@example.com", password: "senha123" },
  { name: "Bruno", email: "email-invalido", password: "senha123" },
  { name: "Bruno", email: "BRUNO@EXAMPLE.COM", password: "senha123" },
  { name: "Bruno", email: "bruno@example.com", password: "123" },
  { name: "Bruno", email: "bruno@example.com", password: "" },
  {},
];

const casosLogin = [
  { email: "bruno@example.com", password: "senha123" },
  { email: "email-invalido", password: "senha123" },
  { email: "bruno@example.com", password: "" },
  {},
];

describe("Contrato: authSchema do backend == authSchema do frontend", () => {
  it("registerSchema: mesmo resultado (sucesso/falha e mensagens) nas duas cópias", () => {
    const resultadosFrontend = rodarSchemaDoFrontend(
      "registerSchema",
      casosRegister,
    );

    casosRegister.forEach((caso, i) => {
      const resultadoBackend = backendSchemas.registerSchema.safeParse(caso);
      const resultadoFrontend = resultadosFrontend[i];

      expect(resultadoFrontend.success).toBe(resultadoBackend.success);

      if (!resultadoBackend.success) {
        const mensagensBackend = resultadoBackend.error.issues.map(
          (issue) => issue.message,
        );
        expect(resultadoFrontend.messages).toEqual(mensagensBackend);
      }
    });
  });

  it("loginSchema: mesmo resultado (sucesso/falha e mensagens) nas duas cópias", () => {
    const resultadosFrontend = rodarSchemaDoFrontend("loginSchema", casosLogin);

    casosLogin.forEach((caso, i) => {
      const resultadoBackend = backendSchemas.loginSchema.safeParse(caso);
      const resultadoFrontend = resultadosFrontend[i];

      expect(resultadoFrontend.success).toBe(resultadoBackend.success);

      if (!resultadoBackend.success) {
        const mensagensBackend = resultadoBackend.error.issues.map(
          (issue) => issue.message,
        );
        expect(resultadoFrontend.messages).toEqual(mensagensBackend);
      }
    });
  });
});
