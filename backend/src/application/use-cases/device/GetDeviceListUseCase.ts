import { injectable, inject } from "tsyringe";
import { DeviceDomainEventFactory } from "@infrastructure/events/handlers/DeviceDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";

@injectable()
export class GetDeviceListUseCase {
  constructor(
    @inject("IDeviceRepository")
    private readonly deviceRepository: IDeviceRepository
  ) {}

  public async execute(data: { ctx: ExecutionContext }) {
    const { ctx } = data;

    // 1. Inicializar evento
    const event = new DeviceDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
    });

    // 2. Obtener lista de dispositivos
    const { error: repositoryError, result: repositoryResult } =
      await this.deviceRepository.getDeviceList();

    if (repositoryError) {
      await EventService.emit(
        event.getDeviceListWithFailure(repositoryError.message)
      );
      throw new Error(repositoryError.message);
    }

    // 3. Emitir evento de éxito
    await EventService.emit(event.getDeviceList());

    // 4. Devolver resultado
    return repositoryResult;
  }
}
