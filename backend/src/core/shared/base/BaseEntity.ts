import { z } from "zod";

/**
 * BaseEntity - Entidad base con fecha de creación
 * @property createdAt - Fecha de creación
 *
 * Se utiliza como base para todas las entidades que necesitan trazabilidad temporal.
 * Usa `coerce.date()` para convertir automáticamente strings ISO 8601 de PostgreSQL JSONB.
 */
export const BaseEntity = z.object({
  createdAt: z.coerce.date().optional().nullable().default(null),
});

export type BaseEntity = z.infer<typeof BaseEntity>;
