import type { Pagination } from "@core/shared/contracts/Pagination";
import type { UserProfileEntity } from "../entities/UserProfileEntity";
import type { GetUserProfileByUserIdContract } from "../contract/GetUserProfileByUserIdContract";

/**
 * IUserProfileRepository - Interfaz del repositorio de perfil de usuario
 *
 * Operaciones que combinan User y UserCard
 */
export interface IUserProfileRepository {
  /**
   * Obtiene el perfil completo de un usuario (user + card)
   * @param data - Datos del usuario
   * @returns Promise<Result<UserProfileEntity>>
   */
  getUserProfileByUserId(
    data: GetUserProfileByUserIdContract
  ): Promise<Result<UserProfileEntity>>;

  /**
   * Obtiene perfiles de usuarios con paginación (users + cards)
   * @param data - Datos de paginación
   * @returns Promise<Result<UserProfileEntity[]>>
   */
  getUserProfilesWithPagination(
    data: Pagination
  ): Promise<Result<UserProfileEntity[]>>;
}
