import { database } from "@infrastructure/database/PostgresDatabase";
import { UserRepositoryErrorFactory } from "./UserRepositoryErrorFactory";
import { IUserRepository } from "@core/user/repositories/IUserRepository";
import { UserEntity } from "@core/user/entities/UserEntity";
import { Pagination } from "@core/shared/contracts/Pagination";

/**
 * UserRepository - Implementación del repositorio de usuarios
 *
 * Implementa IUserRepository para operaciones básicas sobre usuarios
 * sin incluir información de tarjetas (cards).
 */
export class UserRepository implements IUserRepository {
  /**
   * Valida si un ID de usuario existe y está activo
   * @param userId - UUID del usuario a validar
   * @returns Promise<Result<boolean>> - true si el usuario existe y está activo
   */
  public async isValidUserId(userId: UUID): Promise<Result<boolean>> {
    const { error, result } = await database.query<{ isValid: boolean }>({
      query: "SELECT * FROM is_valid_user_id($1)",
      params: [userId],
      single: true,
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new UserRepositoryErrorFactory(error).create() };
    }

    return { result: !!result?.isValid };
  }

  /**
   * Obtiene un usuario por su ID (sin información de tarjeta)
   * @param userId - UUID del usuario a obtener
   * @returns Promise<Result<UserEntity>> - Entidad del usuario
   */
  public async getUserByUserId(userId: UUID): Promise<Result<UserEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_user_by_user_id($1)",
      params: [userId],
      single: true,
      schema: UserEntity,
      emptyResponseMessageError: "User not found",
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new UserRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  /**
   * Obtiene usuarios con paginación (sin información de tarjetas)
   * @param data - Objeto de paginación con limit y offset
   * @returns Promise<Result<UserEntity[]>> - Array de entidades de usuario
   */
  public async getUsersWithPagination(
    data: Pagination
  ): Promise<Result<UserEntity[]>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_users_with_pagination($1, $2)",
      params: [data.limit, data.offset],
      single: false,
      schema: UserEntity,
      isEmptyResponseAnError: false,
    });

    if (error) {
      return { error: new UserRepositoryErrorFactory(error).create() };
    }

    return { result: (result || []) as UserEntity[] };
  }
}
