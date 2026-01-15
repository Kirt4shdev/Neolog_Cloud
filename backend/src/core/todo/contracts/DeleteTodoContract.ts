import { z } from "zod";

/**
 * DeleteTodoContract - Contrato para eliminar un ToDo
 * @property todoId - ID del ToDo a eliminar
 * @property deletedBy - ID del usuario que elimina (inyectado desde ctx)
 */
export const DeleteTodoContract = z.object({
  todoId: z.uuid().trim(),
  deletedBy: z.uuid().trim(),
});

export type DeleteTodoContract = z.infer<typeof DeleteTodoContract>;
