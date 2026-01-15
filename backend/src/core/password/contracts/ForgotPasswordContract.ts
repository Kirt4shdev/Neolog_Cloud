import { z } from "zod";
import { USER } from "@shared/constants/user";

/**
 * ForgotPasswordContract - Contrato para solicitar un cambio de contraseña
 * @property email - Email del usuario
 */
export const ForgotPasswordContract = z.object({
  email: z
    .string({ message: "email is required" })
    .trim()
    .email({ message: "Invalid email format" })
    .min(USER.EMAIL_MIN_LENGTH, {
      message: `email must be at least ${USER.EMAIL_MIN_LENGTH} characters`,
    })
    .max(USER.EMAIL_MAX_LENGTH, {
      message: `email must be at most ${USER.EMAIL_MAX_LENGTH} characters`,
    })
    .toLowerCase(),
});

export type ForgotPasswordContract = z.infer<typeof ForgotPasswordContract>;
