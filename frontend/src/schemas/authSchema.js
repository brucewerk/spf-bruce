import { z } from "zod";

// Regras de validação para cadastro/login.
//
// Existe uma cópia idêntica desta lógica em
// backend/src/schemas/authSchema.js (ali em CommonJS). Ver o comentário
// detalhado naquele arquivo para o porquê de duas cópias em vez de um
// arquivo único em /shared — resumindo: um /shared importado pelos dois
// lados quebrava o build do Vercel (Root Directory: frontend não enxerga
// pastas irmãs) e a resolução do `zod` no Windows local.
// backend/tests/authSchema.contract.test.js garante que as duas cópias
// nunca fiquem dessincronizadas.
export const registerSchema = z.object({
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

export const loginSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório." })
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),
  password: z
    .string({ required_error: "A senha é obrigatória." })
    .min(1, "A senha é obrigatória."),
});
