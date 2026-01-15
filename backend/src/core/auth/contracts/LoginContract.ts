import { z } from "zod";
import { USER } from "@shared/constants/user";
import { PasswordContract } from "@core/shared/contracts/PasswordContract";

/**
 * LoginContract - Contrato de login
 * @property email - Email del usuario
 * @property password - Contraseña del usuario
 */
export const LoginContract = z.object({
  email: z
    .string({ message: "email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" })
    .min(USER.EMAIL_MIN_LENGTH, {
      message: `email must be at least ${USER.EMAIL_MIN_LENGTH} characters`,
    })
    .max(USER.EMAIL_MAX_LENGTH, {
      message: `email must be at most ${USER.EMAIL_MAX_LENGTH} characters`,
    }),
  password: PasswordContract.shape.password,
});

export type LoginContract = z.infer<typeof LoginContract>;
