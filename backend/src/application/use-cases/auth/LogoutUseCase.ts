import { injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { EventService } from "@application/services/EventService";
import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
import { LogoutContract } from "@core/auth/contracts/LogoutContract";
import { DtoValidator } from "@shared/utils/DtoValidator";

@injectable()
export class LogoutUseCase {
  public async execute(data: {
    contract: LogoutContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new AuthDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { jwt: contract?.jwt, sessionId: contract?.sessionId },
    });

    const dto = DtoValidator.validate(LogoutContract, contract);

    if (dto.error) {
      await EventService.emit(event.logoutWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid logout data";
      await EventService.emit(event.logoutWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    await EventService.emit(event.logout());

    return;
  }
}
