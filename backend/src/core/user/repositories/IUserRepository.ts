import type { Pagination } from "@core/shared/contracts/Pagination";
import type { UserEntity } from "../entities/UserEntity";

/**
 * IUserRepository - Interfaz de repositorio de usuario
 * @property isValidUserId - Método para validar si un ID de usuario es válido
 * @property getUserByUserId - Método para obtener un usuario por su ID
 * @property getUsersWithPagination - Método para obtener usuarios con paginación
 */
export interface IUserRepository {
  /**
   * Método para validar si un ID de usuario es válido
   * @param userId - ID del usuario
   * @returns Promise<Result<boolean>>
   */
  isValidUserId(userId: UUID): Promise<Result<boolean>>;

  /**
   * Método para obtener un usuario por su ID
   * @param userId - ID del usuario
   * @returns Promise<Result<UserEntity>>
   */
  getUserByUserId(userId: UUID): Promise<Result<UserEntity>>;

  /**
   * Método para obtener usuarios con paginación
   * @param data - Datos de paginación
   * @returns Promise<Result<UserEntity[]>>
   */
  getUsersWithPagination(data: Pagination): Promise<Result<UserEntity[]>>;
}
