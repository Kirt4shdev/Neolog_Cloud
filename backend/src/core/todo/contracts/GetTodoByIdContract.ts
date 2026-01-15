import { z } from "zod";

/**
 * GetTodoByIdContract - Contrato para obtener un ToDo por ID
 * @property todoId - ID del ToDo a obtener
 */
export const GetTodoByIdContract = z.object({
  todoId: z.uuid().trim(),
});

export type GetTodoByIdContract = z.infer<typeof GetTodoByIdContract>;
