import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { LoginContract } from "@core/auth/contracts/LoginContract";
import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { IAuthRepository } from "@core/auth/repositories/IAuthRepository";
import type { IBlacklistRepository } from "@core/blacklist/repositories/IBlacklistRepository";

@injectable()
export class LoginUseCase {
  constructor(
    @inject("IAuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject("IBlacklistRepository")
    private readonly blacklistRepository: IBlacklistRepository
  ) {}
  public async execute(data: {
    contract: LoginContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new AuthDomainEventFactory({
      ip: ctx?.ip,
      metadata: { email: contract?.email },
    });

    const dto = DtoValidator.validate(LoginContract, contract);

    if (dto.error) {
      await EventService.emit(event.loginWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid login data";
      await EventService.emit(event.loginWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const jwtToken = ctx.jwt;

    if (jwtToken) {
      await EventService.emit(event.loginWithFailure("User already logged in"));
      throw ServerError.badRequest("User already logged in");
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.authRepository.login(dto.result);

    if (repositoryError) {
      await EventService.emit(event.loginWithFailure(repositoryError.message));
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    const { error: blacklistError, result: blacklistResult } =
      await this.blacklistRepository.isUserInBlacklist(
        repositoryResult.userId as UUID
      );

    if (blacklistError) {
      await EventService.emit(event.loginWithFailure(blacklistError.message));
      throw ServerError[blacklistError.type](blacklistError.message);
    }

    if (blacklistResult) {
      await EventService.emit(event.loginWithFailure("User is in blacklist"));
      throw ServerError.forbidden("User is in blacklist");
    }

    await EventService.emit(event.login());

    return repositoryResult;
  }
}
