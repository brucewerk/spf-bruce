// Rodado como subprocesso via child_process (não dentro do Jest) porque o
// Jest não suporta import() dinâmico de ESM sem a flag experimental
// --experimental-vm-modules — mexer nisso globalmente na config do Jest só
// por causa de um teste arriscaria destabilizar o resto da suíte. Um
// processo `node` puro importa ESM nativamente, sem flag nenhuma.
//
// Uso: node runFrontendSchema.js <registerSchema|loginSchema>
// Lê os casos de teste (array JSON) via stdin, escreve os resultados
// (array JSON) via stdout.
const path = require("path");

const schemaName = process.argv[2];

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", async () => {
  const casos = JSON.parse(input);
  const frontendPath = path.join(
    __dirname,
    "../../../frontend/src/schemas/authSchema.js",
  );
  const schemas = await import(`file://${frontendPath}`);
  const schema = schemas[schemaName];

  const resultados = casos.map((caso) => {
    const r = schema.safeParse(caso);
    return {
      success: r.success,
      messages: r.success ? [] : r.error.issues.map((i) => i.message),
    };
  });

  process.stdout.write(JSON.stringify(resultados));
});
