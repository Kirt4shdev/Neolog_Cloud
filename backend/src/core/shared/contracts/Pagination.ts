import { z } from "zod";

/**
 * Pagination - Contrato de paginación
 * @property limit - Cantidad de elementos por página
 * @property offset - Cantidad de elementos a saltar
 *
 * Se utiliza para paginar resultados de consultas a la base de datos.
 */
export const Pagination = z.object({
  limit: z.number().int().positive().optional().default(10),
  offset: z.number().int().nonnegative().optional().default(0),
});

export type Pagination = z.infer<typeof Pagination>;
