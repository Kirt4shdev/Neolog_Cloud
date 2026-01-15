import { z } from "zod";

/**
 * GetTodosWithPaginationContract - Contrato para obtener ToDo's con paginación
 * @property userId - ID del usuario (inyectado desde ctx)
 * @property limit - Número de resultados por página
 * @property offset - Desde qué registro empezar
 */
export const GetTodosWithPaginationContract = z.object({
  userId: z.uuid().trim(),
  limit: z.coerce.number().int().positive().max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export type GetTodosWithPaginationContract = z.infer<
  typeof GetTodosWithPaginationContract
>;
