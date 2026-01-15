import { z } from "zod";

/**
 * AuditableEntity - Entidad auditable con usuario creador
 * @property createdBy - ID del usuario que creó la entidad
 *
 * Se utiliza para rastrear quién creó un registro en la base de datos.
 */
export const AuditableEntity = z.object({
  createdBy: z.uuid().trim().optional().nullable().default(null),
});

export type AuditableEntity = z.infer<typeof AuditableEntity>;
