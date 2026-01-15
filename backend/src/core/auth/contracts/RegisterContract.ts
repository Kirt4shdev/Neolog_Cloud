import { z } from "zod";
import { USER } from "@shared/constants/user";
import { PasswordContract } from "@core/shared/contracts/PasswordContract";

/**
 * RegisterContract - Contrato de registro
 * @property name - Nombre del usuario
 * @property email - Email del usuario
 * @property password - Contraseña del usuario
 */
export const RegisterContract = z.object({
  name: z
    .string({ message: "name is required" })
    .trim()
    .min(USER.NAME_MIN_LENGTH, {
      message: `name must be at least ${USER.NAME_MIN_LENGTH} characters`,
    })
    .max(USER.NAME_MAX_LENGTH, {
      message: `name must be at most ${USER.NAME_MAX_LENGTH} characters`,
    }),
  email: z
    .string({ message: "email is required" })
    .trim()
    .toLowerCase()
    .email({
      message: "Invalid email format",
    })
    .min(USER.EMAIL_MIN_LENGTH, {
      message: `email must be at least ${USER.EMAIL_MIN_LENGTH} characters`,
    })
    .max(USER.EMAIL_MAX_LENGTH, {
      message: `email must be at most ${USER.EMAIL_MAX_LENGTH} characters`,
    }),
  password: PasswordContract.shape.password,
});

export type RegisterContract = z.infer<typeof RegisterContract>;
