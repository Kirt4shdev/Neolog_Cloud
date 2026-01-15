import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { DeleteMySessionContract } from "@core/session/contracts/DeleteMySessionContract";
import { SessionDomainEventFactory } from "@infrastructure/events/handlers/SessionDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ISessionRepository } from "@core/session/repositories/ISessionRepository";

@injectable()
export class DeleteMySessionUseCase {
  constructor(
    @inject("ISessionRepository")
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async execute(data: {
    contract: DeleteMySessionContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new SessionDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { sessionId: contract.sessionId, userId: contract.userId },
    });

    // Validar contrato
    const dto = DtoValidator.validate(DeleteMySessionContract, contract);

    if (dto.error) {
      await EventService.emit(event.deleteSessionWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid session data";
      await EventService.emit(event.deleteSessionWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { userId, sessionId } = dto.result;

    // Verificar que la sesión pertenece al usuario autenticado
    const { error: getUserSessionsError, result: userSessions } =
      await this.sessionRepository.getSessionsByUserId(userId as UUID);

    if (getUserSessionsError) {
      await EventService.emit(
        event.deleteSessionWithFailure(getUserSessionsError.message)
      );
      throw ServerError[getUserSessionsError.type](
        getUserSessionsError.message
      );
    }

    // Buscar si el sessionId está en las sesiones del usuario
    const sessionBelongsToUser = userSessions?.some(
      (session) => session.sessionId === sessionId
    );

    if (!sessionBelongsToUser) {
      const errorMessage = "You can only delete your own sessions";
      await EventService.emit(event.deleteSessionWithFailure(errorMessage));
      throw ServerError.forbidden(errorMessage);
    }

    // Proceder a borrar la sesión (pasando contrato validado)
    const { error: repositoryError, result: repositoryResult } =
      await this.sessionRepository.deleteSession({
        sessionId,
      });

    if (repositoryError) {
      await EventService.emit(
        event.deleteSessionWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Session not found";
      await EventService.emit(event.deleteSessionWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    await EventService.emit(event.deleteSession());

    return repositoryResult;
  }
}
