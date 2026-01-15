import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { RegisterContract } from "@core/auth/contracts/RegisterContract";
import { EventService } from "@application/services/EventService";
import { IAuthRepository } from "@core/auth/repositories/IAuthRepository";
import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";

@injectable()
export class RegisterUseCase {
  constructor(
    @inject("IAuthRepository")
    private readonly authRepository: IAuthRepository
  ) {}

  public async execute(data: {
    contract: RegisterContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(RegisterContract, contract);

    const event = new AuthDomainEventFactory({
      ip: ctx?.ip,
      metadata: { email: contract?.email },
    });

    if (dto.error) {
      await EventService.emit(event.registerWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid registration data";
      await EventService.emit(event.registerWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.authRepository.register(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.registerWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    await EventService.emit(event.register());

    return repositoryResult;
  }
}
