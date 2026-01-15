import { z } from "zod";
import { USER } from "@shared/constants/user";

/**
 * PasswordContract - Contrato de contraseña
 * @property password - Contraseña del usuario
 */
export const PasswordContract = z.object({
  password: z
    .string({ message: "password is required" })
    .trim()
    .min(USER.PASSWORD_MIN_LENGTH, {
      message: `password must be at least ${USER.PASSWORD_MIN_LENGTH} characters`,
    })
    .max(USER.PASSWORD_MAX_LENGTH, {
      message: `password must be at most ${USER.PASSWORD_MAX_LENGTH} characters`,
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      {
        message:
          "password must include uppercase, lowercase, number, and special char",
      }
    ),
});

export type PasswordContract = z.infer<typeof PasswordContract>;
