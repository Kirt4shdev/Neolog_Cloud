import { z } from "zod";

/**
 * ResetPasswordEntity - Entidad para resetear la contraseña
 * @property email - Email del usuario
 */
export const ResetPasswordEntity = z.object({
  email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),
});

export type ResetPasswordEntity = z.infer<typeof ResetPasswordEntity>;
