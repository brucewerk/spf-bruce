import { z } from "zod";

// Fonte única de verdade para as regras de cadastro/login — usada tanto
// pelo backend (validação de segurança, nunca confiar só no cliente)
// quanto pelo frontend (feedback imediato pro usuário, sem round-trip
// à API só pra descobrir que o e-mail é inválido). Antes essas regras
// existiam apenas no backend via express-validator, e o frontend não
// validava nada além dos atributos HTML `required`.
//
// Escrito em ESM (import/export) porque é o que o Vite exige nativamente
// no frontend; o backend (CommonJS) consome isso via import() dinâmico —
// suportado nativamente pelo Node mesmo a partir de um arquivo .js CJS.
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

// Login não exige o mesmo mínimo de 6 caracteres na senha: o objetivo aqui
// é só "o campo foi preenchido", não re-validar uma regra de força que já
// foi aplicada no cadastro (e que poderia mudar no futuro sem invalidar
// contas antigas).
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
