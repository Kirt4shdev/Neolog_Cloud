import { z } from "zod";

/**
 * DeleteSessionContract - Contrato para eliminar una sesión
 * @property sessionId - ID de la sesión a eliminar
 */
export const DeleteSessionContract = z.object({
  sessionId: z
    .string({ message: "sessionId is required" })
    .trim()
    .uuid({ message: "Invalid sessionId format" }),
});

export type DeleteSessionContract = z.infer<typeof DeleteSessionContract>;
