import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import type { IUserRepository } from "@core/user/repositories/IUserRepository";

/**
 * UserService - Servicio de aplicación para operaciones de usuario
 * Usado principalmente por middlewares
 * NO emite eventos de dominio (a diferencia de los Use Cases)
 * No necesita validar el UUID del usuario, ya que es validado por el middleware checkUser
 */
@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository")
    private userRepository: IUserRepository
  ) {}

  public async isValidUserId(userId: UUID): Promise<boolean> {
    const { error, result } = await this.userRepository.isValidUserId(userId);

    if (error) throw ServerError[error.type](error.message);

    return result ?? false;
  }
}
