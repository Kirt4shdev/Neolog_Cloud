import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { ToggleProvisioningContract } from "@core/provisioning/contracts/ProvisioningContract";
import { ProvisioningDomainEventFactory } from "@infrastructure/events/handlers/ProvisioningDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { IProvisioningRepository } from "@core/provisioning/repositories/IProvisioningRepository";

@injectable()
export class ToggleProvisioningUseCase {
  constructor(
    @inject("IProvisioningRepository")
    private readonly provisioningRepository: IProvisioningRepository
  ) {}

  public async execute(data: {
    contract: ToggleProvisioningContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    // 1. Inicializar evento
    const event = new ProvisioningDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { isEnabled: contract?.isEnabled },
    });

    // 2. Validar datos de entrada
    const dto = DtoValidator.validate(ToggleProvisioningContract, contract);

    if (dto.error) {
      await EventService.emit(event.toggleProvisioningWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid provisioning data";
      await EventService.emit(
        event.toggleProvisioningWithFailure(errorMessage)
      );
      throw ServerError.badRequest(errorMessage);
    }

    // 3. Actualizar configuración de provisioning
    const { error: repositoryError, result: repositoryResult } =
      await this.provisioningRepository.toggleProvisioning(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.toggleProvisioningWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    // 4. Emitir evento de éxito
    await EventService.emit(event.toggleProvisioning());

    // 5. Devolver resultado
    return repositoryResult;
  }
}
