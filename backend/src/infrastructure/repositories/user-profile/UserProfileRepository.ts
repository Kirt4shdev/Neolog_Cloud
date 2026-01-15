import { database } from "@infrastructure/database/PostgresDatabase";
import { UserProfileEntity } from "@core/user-profile/entities/UserProfileEntity";
import { UserProfileRepositoryErrorFactory } from "./UserProfileRepositoryErrorFactory";
import { Pagination } from "@core/shared/contracts/Pagination";
import type { IUserProfileRepository } from "@core/user-profile/repositories/IUserProfileRepository";
import type { GetUserProfileByUserIdContract } from "@core/user-profile/contract/GetUserProfileByUserIdContract";

/**
 * UserProfileRepository - Implementación del repositorio de perfil de usuario
 *
 * Implementa IUserProfileRepository para operaciones que combinan User y UserCard.
 */
export class UserProfileRepository implements IUserProfileRepository {
  /**
   * Obtiene el perfil completo de un usuario (user + card)
   * @param data - Datos del usuario
   * @returns Promise<Result<UserProfileEntity>> - Entidad del perfil completo
   */
  public async getUserProfileByUserId(
    data: GetUserProfileByUserIdContract
  ): Promise<Result<UserProfileEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_user_profile_by_user_id($1)",
      params: [data.userId],
      single: true,
      schema: UserProfileEntity,
      emptyResponseMessageError: "User profile not found",
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new UserProfileRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  /**
   * Obtiene perfiles de usuarios con paginación (users + cards)
   * @param data - Datos de paginación
   * @returns Promise<Result<UserProfileEntity[]>> - Lista de perfiles
   */
  public async getUserProfilesWithPagination(
    data: Pagination
  ): Promise<Result<UserProfileEntity[]>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_users_profiles_with_pagination($1, $2)",
      params: [data.limit, data.offset],
      single: false,
      schema: UserProfileEntity,
      emptyResponseMessageError: "No user profiles found",
      isEmptyResponseAnError: false,
    });

    if (error) {
      return { error: new UserProfileRepositoryErrorFactory(error).create() };
    }

    return { result: result || [] };
  }
}
