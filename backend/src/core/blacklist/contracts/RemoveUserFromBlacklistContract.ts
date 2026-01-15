import { z } from "zod";

/**
 * RemoveUserFromBlacklistContract - Contrato para eliminar un usuario de la blacklist
 * @property blockedId - ID del usuario bloqueado
 */
export const RemoveUserFromBlacklistContract = z.object({
  blockedId: z
    .string({ message: "blockedId is required" })
    .trim()
    .uuid({ message: "Invalid blocked user ID format" }),
  removerId: z
    .string({ message: "removerId is required" })
    .trim()
    .uuid({ message: "Invalid remover user ID format" }),
});

export type RemoveUserFromBlacklistContract = z.infer<
  typeof RemoveUserFromBlacklistContract
>;
