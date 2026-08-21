const { z } = require("zod");

// Regras de validação para cadastro/login.
//
// Existe uma cópia idêntica desta lógica em
// frontend/src/schemas/authSchema.js (ali em ESM, pois é o que o Vite
// exige). Tentei inicialmente ter um ÚNICO arquivo em /shared importado
// pelos dois lados, mas isso quebrou em produção: o Vercel builda o
// projeto do frontend com "Root Directory: frontend", ou seja, o processo
// de build nem enxerga uma pasta /shared fora dali — e no Windows local,
// sem um `npm install` extra dentro de /shared, o Node não achava o pacote
// `zod` (ele resolve dependências a partir da localização do arquivo que
// faz o import, não de quem importou). Depender de node_modules
// compartilhado entre pastas irmãs sem um monorepo de verdade (workspaces)
// é frágil demais pra um app em produção.
//
// A solução adotada troca "um arquivo só" por "duas cópias + um teste que
// garante que elas nunca divirjam": backend/tests/authSchema.contract.test.js
// roda a mesma bateria de casos nos dois schemas e falha se as respostas
// não baterem. Isso dá a mesma garantia prática (as regras nunca ficam
// dessincronizadas) sem depender de resolução de módulo entre pastas.
const registerSchema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório." })
    .trim()
    .min(1, "O nome é obrigatório."),
  email: z
    .string({ required_error: "O e-mail é obrigatório." })
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),
  password: z
    .string({ required_error: "A senha é obrigatória." })
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório." })
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),
  password: z
    .string({ required_error: "A senha é obrigatória." })
    .min(1, "A senha é obrigatória."),
});

module.exports = { registerSchema, loginSchema };
