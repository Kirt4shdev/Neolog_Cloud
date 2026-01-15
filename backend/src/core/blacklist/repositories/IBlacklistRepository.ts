import type { Pagination } from "@core/shared/contracts/Pagination";
import type { AddUserToBlacklistContract } from "../contracts/AddUserToBlacklistContract";
import type { RemoveUserFromBlacklistContract } from "../contracts/RemoveUserFromBlacklistContract";
import type { BlacklistEntity } from "../entities/BlacklistEntity";

/**
 * IBlacklistRepository - Interfaz de repositorio de blacklist
 * @property getBlacklistedUsers - Método para obtener los usuarios bloqueados
 * @property addUserToBlacklist - Método para agregar un usuario a la blacklist
 * @property removeUserFromBlacklist - Método para eliminar un usuario de la blacklist
 * @property isUserInBlacklist - Método para verificar si un usuario está en la blacklist
 */
export interface IBlacklistRepository {
  /**
   * Método para obtener los usuarios bloqueados
   * @param data - Datos de paginación y filtro
   * @returns Promise<Result<BlacklistEntity[]>>
   */
  getBlacklistedUsers(
    data: Pagination & { userId?: UUID }
  ): Promise<Result<BlacklistEntity[]>>;

  /**
   * Método para agregar un usuario a la blacklist
   * @param data - Datos de agregado a la blacklist
   * @returns Promise<Result<BlacklistEntity>>
   */
  addUserToBlacklist(
    data: AddUserToBlacklistContract
  ): Promise<Result<BlacklistEntity>>;

  /**
   * Método para eliminar un usuario de la blacklist
   * @param data - Datos de eliminado de la blacklist
   * @param removerId - ID del usuario que elimina
   * @returns Promise<Result<BlacklistEntity>>
   */
  removeUserFromBlacklist(
    data: RemoveUserFromBlacklistContract
  ): Promise<Result<BlacklistEntity>>;

  /**
   * Método para verificar si un usuario está en la blacklist
   * @param userId - ID del usuario
   * @returns Promise<Result<boolean>>
   */
  isUserInBlacklist(userId: UUID): Promise<Result<boolean>>;
}
