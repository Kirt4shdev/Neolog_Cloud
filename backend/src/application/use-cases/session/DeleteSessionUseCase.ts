import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { DeleteSessionContract } from "@core/session/contracts/DeleteSessionContract";
import { SessionDomainEventFactory } from "@infrastructure/events/handlers/SessionDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ISessionRepository } from "@core/session/repositories/ISessionRepository";

@injectable()
export class DeleteSessionUseCase {
  constructor(
    @inject("ISessionRepository")
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async execute(data: {
    contract: DeleteSessionContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new SessionDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { sessionId: contract.sessionId },
    });

    // Validar contrato
    const dto = DtoValidator.validate(DeleteSessionContract, contract);

    if (dto.error) {
      await EventService.emit(event.deleteSessionWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid session data";
      await EventService.emit(event.deleteSessionWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.sessionRepository.deleteSession(dto.result);

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
