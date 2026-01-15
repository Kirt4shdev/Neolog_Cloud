import { z } from "zod";

/**
 * UserRolesIdsEntity - Entidad de usuario con roles
 * @property userId - ID del usuario
 * @property adminId - ID del administrador
 * @property clientId - ID del cliente
 *
 * Esta entidad se utiliza para setear los ids de los roles del usuario en el middleware checkRoles.
 * Es diferente a la entidad RoleEntity porque no tiene los roles propiamente dichos, sino solo los ids de los roles.
 */
export const UserRolesIdsEntity = z.object({
  userId: z.uuid().trim(),
  adminId: z.uuid().trim().nullable(),
  clientId: z.uuid().trim().nullable(),
});

export type UserRolesIdsEntity = z.infer<typeof UserRolesIdsEntity>;
