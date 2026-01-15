import type { UserCardEntity } from "../entities/UserCardEntity";
import type { CreateUserCardContract } from "../contracts/createUserCardContract";
import type { UpdateUserCardContract } from "../contracts/UpdateUserCardContract";

/**
 * IUserCardRepository - Interfaz del repositorio de tarjetas de usuario
 *
 * Operaciones CRUD para tarjetas de usuario
 */
export interface IUserCardRepository {
  /**
   * Crea una nueva tarjeta de usuario
   * @param data - Datos para crear la tarjeta
   * @returns Promise<Result<UserCardEntity>>
   */
  createUserCard(data: CreateUserCardContract): Promise<Result<UserCardEntity>>;

  /**
   * Actualiza una tarjeta de usuario existente
   * @param data - Datos para actualizar la tarjeta
   * @returns Promise<Result<UserCardEntity>>
   */
  updateUserCard(data: UpdateUserCardContract): Promise<Result<UserCardEntity>>;
}
