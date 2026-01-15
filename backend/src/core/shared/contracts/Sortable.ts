import { z } from "zod";

/**
 * Sortable - Contrato de ordenamiento
 * @property sortBy - Campo por el cual ordenar
 * @property sortOrder - Orden ascendente (asc) o descendente (desc)
 *
 * Se utiliza para ordenar resultados de consultas a la base de datos.
 */
export const Sortable = z.object({
  sortBy: z.string().trim(),
  sortOrder: z.enum(["asc", "desc"], {
    message: "Sort order must be 'asc' or 'desc'",
  }),
});

export type Sortable = z.infer<typeof Sortable>;
