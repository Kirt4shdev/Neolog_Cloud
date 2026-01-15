import { z } from "zod";
import { BaseEntity } from "@core/shared/base/BaseEntity";

/**
 * ForgotPasswordEntity - Entidad para solicitar un cambio de contraseña
 * @property email - Email del usuario
 * @property token - Token de recuperación de contraseña
 * @property createdAt - Fecha de creación del token
 *
 * Token de un solo uso, sin soft delete.
 * Se elimina (hard delete) al resetear la contraseña.
 */
export const ForgotPasswordEntity = z
  .object({
    email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),
    token: z.string().trim(),
  })
  .extend(BaseEntity.shape);

export type ForgotPasswordEntity = z.infer<typeof ForgotPasswordEntity>;
