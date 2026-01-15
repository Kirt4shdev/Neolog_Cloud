import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { ResetPasswordContract } from "@core/password/contracts/ResetPasswordContract";
import { EventService } from "@application/services/EventService";
import { PasswordRecoveryDomainEventFactory } from "@infrastructure/events/handlers/PasswordRecoveryDomainEventFactory";
import type { IPasswordRepository } from "@core/password/repositories/IPasswordRepository";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("IPasswordRepository")
    private repository: IPasswordRepository
  ) {}

  public async execute(data: {
    contract: ResetPasswordContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(ResetPasswordContract, contract);

    const event = new PasswordRecoveryDomainEventFactory({
      ip: ctx?.ip,
      metadata: { token: contract?.token },
    });

    if (dto.error) {
      await EventService.emit(event.resetPasswordWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid credentials";
      await EventService.emit(event.resetPasswordWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.repository.resetPassword({
        token: dto.result.token,
        password: dto.result.password,
        repeatPassword: dto.result.repeatPassword,
      });

    if (repositoryError) {
      await EventService.emit(
        event.resetPasswordWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Invalid token";
      await EventService.emit(event.resetPasswordWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    await EventService.emit(event.resetPassword());

    return { email: repositoryResult.email };
  }
}
