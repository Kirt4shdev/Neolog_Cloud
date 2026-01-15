import { USER } from "@shared/constants/user";
import { z } from "zod";

/**
 * AuthEntity - Entidad de autenticación
 * @property userId - ID del usuario
 * @property name - Nombre del usuario
 * @property email - Email del usuario
 *
 * AuthEntity se utiliza para autenticar a un usuario a la hora de iniciar sesión o registrarse como nuevo usuario.
 * No tiene auditoría porque no se guarda en la base de datos.
 * Es un DTO de respuesta para el contexto de autenticación y registro de usuarios.
 * Esta entidad es diferente a la entidad UserEntity.
 */
export const AuthEntity = z.object({
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
});

export type AuthEntity = z.infer<typeof AuthEntity>;
