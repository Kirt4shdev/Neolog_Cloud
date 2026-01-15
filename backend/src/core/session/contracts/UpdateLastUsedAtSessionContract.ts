import { z } from "zod";

/**
 * UpdateLastUsedAtSessionContract - Contrato para actualizar la fecha de última utilización de una sesión
 * @property sessionId - ID de la sesión a actualizar
 */
export const UpdateLastUsedAtSessionContract = z.object({
  sessionId: z
    .string({ message: "sessionId is required" })
    .trim()
    .uuid({ message: "Invalid sessionId format" }),
});

export type UpdateLastUsedAtSessionContract = z.infer<
  typeof UpdateLastUsedAtSessionContract
>;
