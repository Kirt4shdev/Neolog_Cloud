import { injectable, inject } from "tsyringe";
import { ProvisioningDomainEventFactory } from "@infrastructure/events/handlers/ProvisioningDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { IProvisioningRepository } from "@core/provisioning/repositories/IProvisioningRepository";

@injectable()
export class GetProvisioningStatusUseCase {
  constructor(
    @inject("IProvisioningRepository")
    private readonly provisioningRepository: IProvisioningRepository
  ) {}

  public async execute(data: { ctx: ExecutionContext }) {
    const { ctx } = data;

    // 1. Inicializar evento
    const event = new ProvisioningDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
    });

    // 2. Obtener estado del provisioning
    const { error: repositoryError, result: repositoryResult } =
      await this.provisioningRepository.getProvisioningStatus();

    if (repositoryError) {
      await EventService.emit(
        event.getProvisioningStatusWithFailure(repositoryError.message)
      );
      throw new Error(repositoryError.message);
    }

    // 3. Emitir evento de éxito
    await EventService.emit(event.getProvisioningStatus());

    // 4. Devolver resultado
    return repositoryResult;
  }
}
