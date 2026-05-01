import { z } from "zod";

import { INPUT_LIMITS } from "@/lib/constants/input-limits";

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z
    .string()
    .min(
      INPUT_LIMITS.PASSWORD_MIN,
      `A senha deve ter pelo menos ${INPUT_LIMITS.PASSWORD_MIN} caracteres.`,
    )
    .max(INPUT_LIMITS.PASSWORD_MAX, "Senha muito longa."),
});

export const signupSchema = loginSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(
      INPUT_LIMITS.PROFILE_NAME_MIN,
      "Informe seu nome completo.",
    )
    .max(INPUT_LIMITS.PROFILE_NAME_MAX, "Nome muito longo."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
