import { z } from "zod";
import { BaseEntity } from "./BaseEntity";

/**
 * TimestampedEntity - Entidad con marcas de tiempo
 * @property updatedAt - Fecha de última actualización
 *
 * Extiende BaseEntity (createdAt) y agrega updatedAt.
 * Se utiliza para entidades que solo necesitan auditoría temporal básica,
 * sin rastrear quién realizó los cambios.
 * Usa `coerce.date()` para convertir automáticamente strings ISO 8601 de PostgreSQL JSONB.
 */
export const TimestampedEntity = z
  .object({
    updatedAt: z.coerce.date().optional().nullable().default(null),
  })
  .extend(BaseEntity.shape);

export type TimestampedEntity = z.infer<typeof TimestampedEntity>;
