import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { RemoveUserFromBlacklistContract } from "@core/blacklist/contracts/RemoveUserFromBlacklistContract";
import { EventService } from "@application/services/EventService";
import { BlacklistEventFactory } from "@infrastructure/events/handlers/BlacklistEventFactory";
import type { IBlacklistRepository } from "@core/blacklist/repositories/IBlacklistRepository";

@injectable()
export class RemoveUserFromBlacklistUseCase {
  constructor(
    @inject("IBlacklistRepository")
    private repository: IBlacklistRepository
  ) {}

  public async execute(data: {
    contract: RemoveUserFromBlacklistContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(
      RemoveUserFromBlacklistContract,
      contract
    );

    const event = new BlacklistEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: {
        blockedId: contract?.blockedId,
        removerId: contract?.removerId,
      },
    });

    if (dto.error) {
      await EventService.emit(event.removeFromBlacklistWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid request body";
      await EventService.emit(
        event.removeFromBlacklistWithFailure(errorMessage)
      );
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.repository.removeUserFromBlacklist(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.removeFromBlacklistWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Failed to remove user from blacklist";
      await EventService.emit(
        event.removeFromBlacklistWithFailure(errorMessage)
      );
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.removeFromBlacklist());

    return repositoryResult;
  }
}
