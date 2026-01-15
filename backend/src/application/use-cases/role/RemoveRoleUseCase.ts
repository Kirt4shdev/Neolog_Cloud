import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { RemoveRoleContract } from "@core/role/contracts/RemoveRoleContract";
import { EventService } from "@application/services/EventService";
import { RoleDomainEventFactory } from "@infrastructure/events/handlers/RoleDomainEventFactory";
import type { IRoleRepository } from "@core/role/repositories/IRoleRepository";

@injectable()
export class RemoveRoleUseCase {
  constructor(
    @inject("IRoleRepository")
    private repository: IRoleRepository
  ) {}

  public async execute(data: {
    contract: RemoveRoleContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(RemoveRoleContract, contract);

    const event = new RoleDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: {
        userIdToRemoveRole: contract?.userIdToRemoveRole,
        deletedBy: contract?.deletedBy,
        role: contract?.role,
      },
    });

    if (dto.error) {
      await EventService.emit(event.removeRoleWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid request body";
      await EventService.emit(event.removeRoleWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.repository.removeRole(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.removeRoleWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Error removing role";
      await EventService.emit(event.removeRoleWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.removeRole());

    return repositoryResult;
  }
}
