import { USER } from "@shared/constants/user";
import { z } from "zod";
import { BaseEntity } from "@core/shared/base/BaseEntity";

/**
 * UserEntity - Entidad de usuario
 * @property userId - ID del usuario
 * @property name - Nombre del usuario
 * @property email - Email del usuario
 *
 * Hereda de BaseEntity:
 * - createdAt: Fecha de creación
 */
export const UserEntity = z
  .object({
    userId: z.uuid().trim(),
    name: z.string().trim().min(USER.NAME_MIN_LENGTH).max(USER.NAME_MAX_LENGTH),
    email: z
      .email({ message: "Invalid email address" })
      .min(USER.EMAIL_MIN_LENGTH, {
        message: `Email must be at least ${USER.EMAIL_MIN_LENGTH} characters`,
      })
      .max(USER.EMAIL_MAX_LENGTH, {
        message: `Email must be at most ${USER.EMAIL_MAX_LENGTH} characters`,
      })
      .trim()
      .toLowerCase(),
  })
  .extend(BaseEntity.shape);

export type UserEntity = z.infer<typeof UserEntity>;
