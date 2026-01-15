import { z } from "zod";

/**
 * UpdateableEntity - Entidad actualizable
 * @property updatedAt - Fecha de última actualización
 * @property updatedBy - ID del usuario que actualizó la entidad
 *
 * Se utiliza para rastrear cuándo y quién actualizó un registro por última vez.
 * Usa `coerce.date()` para convertir automáticamente strings ISO 8601 de PostgreSQL JSONB.
 */
export const UpdateableEntity = z.object({
  updatedAt: z.coerce.date().optional().nullable().default(null),
  updatedBy: z.uuid().trim().optional().nullable().default(null),
});

export type UpdateableEntity = z.infer<typeof UpdateableEntity>;
