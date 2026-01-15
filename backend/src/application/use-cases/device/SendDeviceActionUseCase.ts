import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { SendDeviceActionContract } from "@core/device/contracts/DeviceContract";
import { DeviceDomainEventFactory } from "@infrastructure/events/handlers/DeviceDomainEventFactory";
import { EventService } from "@application/services/EventService";
import { mqttService } from "@infrastructure/mqtt";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";

@injectable()
export class SendDeviceActionUseCase {
  constructor(
    @inject("IDeviceRepository")
    private readonly deviceRepository: IDeviceRepository
  ) {}

  public async execute(data: {
    contract: SendDeviceActionContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    // 1. Inicializar evento
    const event = new DeviceDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { deviceId: contract?.deviceId, action: contract?.action },
    });

    // 2. Validar datos de entrada
    const dto = DtoValidator.validate(SendDeviceActionContract, contract);

    if (dto.error) {
      await EventService.emit(event.sendDeviceActionWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid action data";
      await EventService.emit(event.sendDeviceActionWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // 3. Obtener el dispositivo para obtener su serial number
    const { result: device, error: deviceError } =
      await this.deviceRepository.getDeviceDetail({
        deviceId: dto.result.deviceId,
      });

    if (deviceError) {
      await EventService.emit(
        event.sendDeviceActionWithFailure(deviceError.message)
      );
      throw ServerError[deviceError.type](deviceError.message);
    }

    if (!device) {
      const errorMessage = "Device not found";
      await EventService.emit(event.sendDeviceActionWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    // 4. Publicar la acción por MQTT
    const { error: mqttError } = await mqttService.publishAction(
      device.serialNumber,
      dto.result.action
    );

    if (mqttError) {
      await EventService.emit(
        event.sendDeviceActionWithFailure(mqttError.message)
      );
      throw ServerError.internalServer(
        `Failed to send action: ${mqttError.message}`
      );
    }

    // 5. Registrar la acción en la base de datos
    const { error: repositoryError, result: repositoryResult } =
      await this.deviceRepository.logAction(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.sendDeviceActionWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    // 6. Emitir evento de éxito
    await EventService.emit(event.sendDeviceAction());

    // 7. Devolver resultado
    return repositoryResult;
  }
}
