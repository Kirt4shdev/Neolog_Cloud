import type { RoleEntity } from "../entities/RoleEntity";
import type { AssignRoleContract } from "../contracts/AssignRoleContract";
import type { RemoveRoleContract } from "../contracts/RemoveRoleContract";
import type { UserRolesIdsEntity } from "../entities/UserRolesIdsEntity";

/**
 * IRoleRepository - Interfaz de repositorio de roles
 * @property getRolesByUserId - Método para obtener los roles de un usuario
 * @property assignRole - Método para asignar un rol a un usuario
 * @property removeRole - Método para eliminar un rol de un usuario
 */
export interface IRoleRepository {
  /**
   * Método para obtener los roles de un usuario
   * @param userId - ID del usuario
   * @returns Promise<Result<UserRolesIdsEntity>>
   */
  getRolesByUserId(userId: UUID): Promise<Result<UserRolesIdsEntity>>;
  /**
   * Método para asignar un rol a un usuario
   * @param data - Datos de asignación de rol
   * @returns Promise<Result<RoleEntity>>
   */
  assignRole(data: AssignRoleContract): Promise<Result<RoleEntity>>;

  /**
   * Método para eliminar un rol de un usuario
   * @param data - Datos de eliminación de rol
   * @returns Promise<Result<RoleEntity>>
   */
  removeRole(data: RemoveRoleContract): Promise<Result<RoleEntity>>;
}
