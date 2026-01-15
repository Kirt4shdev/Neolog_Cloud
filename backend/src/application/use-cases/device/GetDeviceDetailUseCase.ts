import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { GetDeviceDetailContract } from "@core/device/contracts/DeviceContract";
import { DeviceDomainEventFactory } from "@infrastructure/events/handlers/DeviceDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";

@injectable()
export class GetDeviceDetailUseCase {
  constructor(
    @inject("IDeviceRepository")
    private readonly deviceRepository: IDeviceRepository
  ) {}

  public async execute(data: {
    contract: GetDeviceDetailContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    // 1. Inicializar evento
    const event = new DeviceDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { deviceId: contract?.deviceId },
    });

    // 2. Validar datos de entrada
    const dto = DtoValidator.validate(GetDeviceDetailContract, contract);

    if (dto.error) {
      await EventService.emit(event.getDeviceDetailWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid device ID";
      await EventService.emit(event.getDeviceDetailWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // 3. Obtener detalle del dispositivo
    const { error: repositoryError, result: repositoryResult } =
      await this.deviceRepository.getDeviceDetail(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.getDeviceDetailWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    // 4. Emitir evento de éxito
    await EventService.emit(event.getDeviceDetail());

    // 5. Devolver resultado
    return repositoryResult;
  }
}
