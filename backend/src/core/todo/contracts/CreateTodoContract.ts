import { z } from "zod";
import { TODO } from "@shared/constants/todo";

/**
 * CreateTodoContract - Contrato para crear un ToDo
 * @property userId - ID del usuario (inyectado desde ctx)
 * @property title - Título del ToDo
 * @property description - Descripción del ToDo (opcional)
 * @property priority - Prioridad del ToDo (opcional)
 * @property dueDate - Fecha límite del ToDo (opcional)
 */
export const CreateTodoContract = z.object({
  userId: z.uuid().trim(),
  title: z
    .string({ message: "title is required" })
    .trim()
    .min(TODO.TITLE_MIN_LENGTH, {
      message: `title must be at least ${TODO.TITLE_MIN_LENGTH} character`,
    })
    .max(TODO.TITLE_MAX_LENGTH, {
      message: `title must be at most ${TODO.TITLE_MAX_LENGTH} characters`,
    }),
  description: z
    .string()
    .trim()
    .max(TODO.DESCRIPTION_MAX_LENGTH, {
      message: `description must be at most ${TODO.DESCRIPTION_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  priority: z
    .enum(["low", "medium", "high"], {
      message: "priority must be low, medium or high",
    })
    .optional()
    .nullable()
    .default(null),
  dueDate: z.coerce
    .date({ message: "dueDate must be a valid date" })
    .optional()
    .nullable()
    .default(null),
});

export type CreateTodoContract = z.infer<typeof CreateTodoContract>;
