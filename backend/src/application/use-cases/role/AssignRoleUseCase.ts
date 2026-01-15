import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { AssignRoleContract } from "@core/role/contracts/AssignRoleContract";
import { EventService } from "@application/services/EventService";
import { RoleDomainEventFactory } from "@infrastructure/events/handlers/RoleDomainEventFactory";
import type { IRoleRepository } from "@core/role/repositories/IRoleRepository";

@injectable()
export class AssignRoleUseCase {
  constructor(
    @inject("IRoleRepository")
    private repository: IRoleRepository
  ) {}

  public async execute(data: {
    contract: AssignRoleContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(AssignRoleContract, contract);

    const event = new RoleDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: {
        userIdToAssignRole: contract?.userIdToAssignRole,
        createdBy: contract?.createdBy,
        role: contract?.role,
      },
    });

    if (dto.error) {
      await EventService.emit(event.assignRoleWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid request body";
      await EventService.emit(event.assignRoleWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.repository.assignRole(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.assignRoleWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Error assigning role";
      await EventService.emit(event.assignRoleWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.assignRole());

    return repositoryResult;
  }
}
