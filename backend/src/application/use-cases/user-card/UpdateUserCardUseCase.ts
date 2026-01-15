import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { UpdateUserCardContract } from "@core/user-card/contracts/UpdateUserCardContract";
import { EventService } from "@application/services/EventService";
import { UserCardDomainEventFactory } from "@infrastructure/events/handlers/UserCardDomainEventFactory";
import type { IUserCardRepository } from "@core/user-card/repositories/IUserCardRepository";

@injectable()
export class UpdateUserCardUseCase {
  constructor(
    @inject("IUserCardRepository")
    private readonly userCardRepository: IUserCardRepository
  ) {}

  public async execute(data: {
    contract: UpdateUserCardContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(UpdateUserCardContract, contract);

    const event = new UserCardDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
    });

    if (dto.error) {
      await EventService.emit(event.userCardUpdatedWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid user card data";
      await EventService.emit(event.userCardUpdatedWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.userCardRepository.updateUserCard(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.userCardUpdatedWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Failed to update user card";
      await EventService.emit(event.userCardUpdatedWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.userCardUpdated());

    return repositoryResult;
  }
}
