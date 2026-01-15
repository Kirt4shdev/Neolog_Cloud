import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { AddUserToBlacklistContract } from "@core/blacklist/contracts/AddUserToBlacklistContract";
import { EventService } from "@application/services/EventService";
import { BlacklistEventFactory } from "@infrastructure/events/handlers/BlacklistEventFactory";
import type { IBlacklistRepository } from "@core/blacklist/repositories/IBlacklistRepository";

@injectable()
export class AddUserToBlacklistUseCase {
  constructor(
    @inject("IBlacklistRepository")
    private repository: IBlacklistRepository
  ) {}

  public async execute(data: {
    contract: AddUserToBlacklistContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(AddUserToBlacklistContract, contract);

    const event = new BlacklistEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: {
        blockedId: contract?.blockedId,
        blockerId: contract?.blockerId,
        reason: contract?.reason,
      },
    });

    if (dto.error) {
      await EventService.emit(event.addToBlacklistWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid request body";
      await EventService.emit(event.addToBlacklistWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.repository.addUserToBlacklist(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.addToBlacklistWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Failed to add user to blacklist";
      await EventService.emit(event.addToBlacklistWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.addToBlacklist());

    return repositoryResult;
  }
}
