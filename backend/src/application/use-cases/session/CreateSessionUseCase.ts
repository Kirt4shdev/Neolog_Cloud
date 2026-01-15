import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { CreateSessionContract } from "@core/session/contracts/CreateSessionContract";
import { SessionDomainEventFactory } from "@infrastructure/events/handlers/SessionDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ISessionRepository } from "@core/session/repositories/ISessionRepository";

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject("ISessionRepository")
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async execute(data: {
    contract: CreateSessionContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new SessionDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: {
        userId: contract?.userId,
        jwt: contract?.jwt,
        userAgent: contract?.userAgent,
      },
    });

    const dto = DtoValidator.validate(CreateSessionContract, contract);

    if (dto.error) {
      await EventService.emit(event.createSessionWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid session data";
      await EventService.emit(event.createSessionWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.sessionRepository.createSession(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.createSessionWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Error creating session";
      await EventService.emit(event.createSessionWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.createSession());

    return repositoryResult;
  }
}
