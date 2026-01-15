import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import type { IBlacklistRepository } from "@core/blacklist/repositories/IBlacklistRepository";

/**
 * BlacklistService - Servicio de aplicación para operaciones de blacklist
 * Usado principalmente por middlewares
 * NO emite eventos de dominio (a diferencia de los Use Cases)
 * No necesita validar el UUID del usuario, ya que es validado por el middleware checkUser
 */
@injectable()
export class BlacklistService {
  constructor(
    @inject("IBlacklistRepository")
    private blacklistRepository: IBlacklistRepository
  ) {}

  public async isUserInBlacklist(userId: UUID): Promise<boolean> {
    const { error, result } = await this.blacklistRepository.isUserInBlacklist(
      userId
    );

    if (error) throw ServerError[error.type](error.message);

    return result ?? false;
  }
}
