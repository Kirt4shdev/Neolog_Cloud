import { z } from "zod";

/**
 * DeleteMySessionContract - Contrato para eliminar una sesión propia
 * @property sessionId - ID de la sesión a eliminar
 * @property userId - ID del usuario autenticado (para verificar pertenencia)
 */
export const DeleteMySessionContract = z.object({
  sessionId: z
    .string({ message: "sessionId is required" })
    .trim()
    .uuid({ message: "Invalid sessionId format" }),
  userId: z
    .string({ message: "userId is required" })
    .trim()
    .uuid({ message: "Invalid userId format" }),
});

export type DeleteMySessionContract = z.infer<typeof DeleteMySessionContract>;
