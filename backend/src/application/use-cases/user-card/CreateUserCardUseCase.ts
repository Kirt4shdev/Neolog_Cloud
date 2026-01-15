import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { CreateUserCardContract } from "@core/user-card/contracts/createUserCardContract";
import { EventService } from "@application/services/EventService";
import { UserCardDomainEventFactory } from "@infrastructure/events/handlers/UserCardDomainEventFactory";
import type { IUserCardRepository } from "@core/user-card/repositories/IUserCardRepository";

@injectable()
export class CreateUserCardUseCase {
  constructor(
    @inject("IUserCardRepository")
    private readonly userCardRepository: IUserCardRepository
  ) {}

  public async execute(data: {
    contract: CreateUserCardContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(CreateUserCardContract, contract);

    const event = new UserCardDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
    });

    if (dto.error) {
      await EventService.emit(event.userCardCreatedWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid user card data";
      await EventService.emit(event.userCardCreatedWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.userCardRepository.createUserCard(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.userCardCreatedWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Failed to create user card";
      await EventService.emit(event.userCardCreatedWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.userCardCreated());

    return repositoryResult;
  }
}
