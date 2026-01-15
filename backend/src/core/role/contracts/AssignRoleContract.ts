import { z } from "zod";
import { Role } from "./Role";

/**
 * AssignRoleContract - Contrato para asignar un rol a un usuario
 * @property userIdToAssignRole - ID del usuario al cual se asignará el rol
 * @property createdBy - ID del usuario que asignará el rol
 * @property role - Rol a asignar
 */
export const AssignRoleContract = z.object({
  userIdToAssignRole: z
    .string({ message: "userIdToAssignRole is required" })
    .trim()
    .uuid({ message: "Invalid userIdToAssignRole format" }),
  createdBy: z
    .string({ message: "createdBy is required" })
    .trim()
    .uuid({ message: "Invalid createdBy format" }),
  role: Role,
});

export type AssignRoleContract = z.infer<typeof AssignRoleContract>;
