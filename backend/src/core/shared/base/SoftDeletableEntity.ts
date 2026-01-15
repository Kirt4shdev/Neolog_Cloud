import { z } from "zod";

/**
 * SoftDeletableEntity - Entidad con borrado lógico (soft delete)
 * @property deletedAt - Fecha de eliminación (null si no está eliminado)
 * @property deletedBy - ID del usuario que eliminó la entidad (null si no está eliminado)
 *
 * Se utiliza para implementar borrado lógico en lugar de borrado físico.
 * Los registros no se eliminan realmente de la base de datos, solo se marcan como eliminados.
 * Usa `coerce.date()` para convertir automáticamente strings ISO 8601 de PostgreSQL JSONB.
 */
export const SoftDeletableEntity = z.object({
  deletedAt: z.coerce.date().optional().nullable().default(null),
  deletedBy: z.uuid().trim().optional().nullable().default(null),
});

export type SoftDeletableEntity = z.infer<typeof SoftDeletableEntity>;
