import { z } from "zod";
import { Role } from "./Role";

/**
 * RemoveRoleContract - Contrato para eliminar un rol de un usuario
 * @property userIdToRemoveRole - ID del usuario del cual se eliminará el rol
 * @property createdBy - ID del usuario que eliminará el rol
 * @property role - Rol a eliminar
 */
export const RemoveRoleContract = z.object({
  userIdToRemoveRole: z
    .string({ message: "userIdToRemoveRole is required" })
    .trim()
    .uuid({ message: "Invalid userIdToRemoveRole format" }),
  deletedBy: z
    .string({ message: "deletedBy is required" })
    .trim()
    .uuid({ message: "Invalid deletedBy format" }),
  role: Role,
});

export type RemoveRoleContract = z.infer<typeof RemoveRoleContract>;
