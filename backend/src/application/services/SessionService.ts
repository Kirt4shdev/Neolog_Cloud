import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import type { ISessionRepository } from "@core/session/repositories/ISessionRepository";
import { SessionEntity } from "@core/session/entities/SessionEntity";

/**
 * RoleService - Servicio de aplicación para operaciones de roles
 * Usado principalmente por middlewares
 * NO emite eventos de dominio (a diferencia de los Use Cases)
 * No necesita validar el UUID del usuario, ya que es validado por el middleware checkUser
 */
@injectable()
export class SessionService {
  constructor(
    @inject("ISessionRepository")
    private sessionRepository: ISessionRepository
  ) {}

  public async updateLastUsedAtSession(sessionId: UUID): Promise<void> {
    const { error } = await this.sessionRepository.updateLastUsedAtSession(
      sessionId
    );

    if (error) throw ServerError[error.type](error.message);

    return;
  }

  public async getSessionsByUserId(userId: UUID): Promise<SessionEntity[]> {
    const { error: repositoryError, result: repositoryResult } =
      await this.sessionRepository.getSessionsByUserId(userId);

    if (repositoryError)
      throw ServerError[repositoryError.type](repositoryError.message);

    if (!repositoryResult) throw ServerError.notFound("No sessions found");

    return repositoryResult;
  }
}
