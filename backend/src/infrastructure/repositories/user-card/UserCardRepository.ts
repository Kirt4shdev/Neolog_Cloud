import { database } from "@infrastructure/database/PostgresDatabase";
import { UserCardRepositoryErrorFactory } from "./UserCardRepositoryErrorFactory";
import { UserCardEntity } from "@core/user-card/entities/UserCardEntity";
import { CreateUserCardContract } from "@core/user-card/contracts/createUserCardContract";
import { UpdateUserCardContract } from "@core/user-card/contracts/UpdateUserCardContract";
import type { IUserCardRepository } from "@core/user-card/repositories/IUserCardRepository";

/**
 * UserCardRepository - Implementación del repositorio de tarjetas de usuario
 *
 * Implementa IUserCardRepository para operaciones CRUD sobre tarjetas de usuario.
 */
export class UserCardRepository implements IUserCardRepository {
  /**
   * Crea una nueva tarjeta de usuario
   * @param data - Datos para crear la tarjeta
   * @returns Promise<Result<UserCardEntity>> - Entidad de la tarjeta creada
   */
  public async createUserCard(
    data: CreateUserCardContract
  ): Promise<Result<UserCardEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM create_user_card($1, $2, $3, $4, $5, $6, $7, $8)",
      params: [
        data.userId,
        data.phoneNumber,
        data.phonePrefix,
        data.country,
        data.city,
        data.address1,
        data.address2,
        data.description,
      ],
      single: true,
      schema: UserCardEntity,
      emptyResponseMessageError: "Failed to create user card",
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new UserCardRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  /**
   * Actualiza una tarjeta de usuario existente
   * @param data - Datos para actualizar la tarjeta
   * @returns Promise<Result<UserCardEntity>> - Entidad de la tarjeta actualizada
   */
  public async updateUserCard(
    data: UpdateUserCardContract
  ): Promise<Result<UserCardEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM update_user_card($1, $2, $3, $4, $5, $6, $7, $8)",
      params: [
        data.userId,
        data.phoneNumber,
        data.phonePrefix,
        data.country,
        data.city,
        data.address1,
        data.address2,
        data.description,
      ],
      single: true,
      schema: UserCardEntity,
      emptyResponseMessageError: "Failed to update user card",
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new UserCardRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  /**
   * Obtiene una tarjeta de usuario por ID de usuario
   * @param userId - UUID del usuario
   * @returns Promise<Result<UserCardEntity>> - Entidad de la tarjeta
   */
  public async getUserCardByUserId(
    userId: UUID
  ): Promise<Result<UserCardEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_user_card_by_user_id($1)",
      params: [userId],
      single: true,
      schema: UserCardEntity,
      emptyResponseMessageError: "User card not found",
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new UserCardRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
