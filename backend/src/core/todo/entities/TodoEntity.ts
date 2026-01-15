import { z } from "zod";
import { TODO } from "@shared/constants/todo";
import { TimestampedEntity } from "@core/shared/base/TimestampedEntity";
import { SoftDeletableEntity } from "@core/shared/base/SoftDeletableEntity";

/**
 * TodoEntity - Entidad de ToDo
 * @property todoId - ID del ToDo
 * @property userId - ID del usuario propietario
 * @property title - Título del ToDo
 * @property description - Descripción del ToDo (opcional)
 * @property isCompleted - Estado de completado
 * @property priority - Prioridad del ToDo (opcional)
 * @property dueDate - Fecha límite del ToDo (opcional)
 *
 * Hereda de TimestampedEntity:
 * @property createdAt - Fecha de creación
 * @property updatedAt - Fecha de última actualización
 *
 * Hereda de SoftDeletableEntity:
 * @property deletedAt - Fecha de eliminación
 * @property deletedBy - ID del usuario que eliminó
 */
export const TodoEntity = z
  .object({
    todoId: z.uuid().trim(),
    userId: z.uuid().trim(),
    title: z
      .string()
      .trim()
      .min(TODO.TITLE_MIN_LENGTH)
      .max(TODO.TITLE_MAX_LENGTH),
    description: z
      .string()
      .trim()
      .max(TODO.DESCRIPTION_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    isCompleted: z.boolean().default(false),
    priority: z
      .enum(["low", "medium", "high"])
      .optional()
      .nullable()
      .default(null),
    dueDate: z.coerce.date().optional().nullable().default(null),
  })
  .extend(TimestampedEntity.shape)
  .extend(SoftDeletableEntity.shape);

export type TodoEntity = z.infer<typeof TodoEntity>;
