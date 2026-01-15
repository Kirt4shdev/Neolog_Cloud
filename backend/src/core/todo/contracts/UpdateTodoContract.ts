import { z } from "zod";
import { TODO } from "@shared/constants/todo";

/**
 * UpdateTodoContract - Contrato para actualizar un ToDo
 * @property todoId - ID del ToDo a actualizar
 * @property title - Título del ToDo (opcional)
 * @property description - Descripción del ToDo (opcional)
 * @property isCompleted - Estado de completado (opcional)
 * @property priority - Prioridad del ToDo (opcional)
 * @property dueDate - Fecha límite del ToDo (opcional)
 */
export const UpdateTodoContract = z.object({
  todoId: z.uuid().trim(),
  title: z
    .string()
    .trim()
    .min(TODO.TITLE_MIN_LENGTH, {
      message: `title must be at least ${TODO.TITLE_MIN_LENGTH} character`,
    })
    .max(TODO.TITLE_MAX_LENGTH, {
      message: `title must be at most ${TODO.TITLE_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(TODO.DESCRIPTION_MAX_LENGTH, {
      message: `description must be at most ${TODO.DESCRIPTION_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable(),
  isCompleted: z.boolean().optional().nullable(),
  priority: z
    .enum(["low", "medium", "high"], {
      message: "priority must be low, medium or high",
    })
    .optional()
    .nullable(),
  dueDate: z.coerce
    .date({ message: "dueDate must be a valid date" })
    .optional()
    .nullable(),
});

export type UpdateTodoContract = z.infer<typeof UpdateTodoContract>;
