import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { DeleteDeviceContract } from "@core/device/contracts/DeviceContract";
import { DeviceDomainEventFactory } from "@infrastructure/events/handlers/DeviceDomainEventFactory";
import { EventService } from "@application/services/EventService";
import { mosquittoService } from "@infrastructure/mosquitto";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";

@injectable()
export class DeleteDeviceUseCase {
  constructor(
    @inject("IDeviceRepository")
    private readonly deviceRepository: IDeviceRepository
  ) {}

  public async execute(data: {
    contract: DeleteDeviceContract;
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
    const dto = DtoValidator.validate(DeleteDeviceContract, contract);

    if (dto.error) {
      await EventService.emit(event.deleteDeviceWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid device ID";
      await EventService.emit(event.deleteDeviceWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // 3. Obtener el dispositivo primero para obtener su serial number
    const { result: device, error: deviceError } =
      await this.deviceRepository.getDeviceDetail({
        deviceId: dto.result.deviceId,
      });

    if (deviceError) {
      await EventService.emit(
        event.deleteDeviceWithFailure(deviceError.message)
      );
      throw ServerError[deviceError.type](deviceError.message);
    }

    if (!device) {
      const errorMessage = "Device not found";
      await EventService.emit(event.deleteDeviceWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    // 4. Eliminar el dispositivo de la base de datos
    const { error: deleteError, result: deletedDevice } =
      await this.deviceRepository.deleteDevice(dto.result);

    if (deleteError) {
      await EventService.emit(
        event.deleteDeviceWithFailure(deleteError.message)
      );
      throw ServerError[deleteError.type](deleteError.message);
    }

    // 5. Eliminar el usuario de Mosquitto y su ACL
    const { error: mosquittoError } = await mosquittoService.deleteDevice(
      device.serialNumber
    );

    if (mosquittoError) {
      await EventService.emit(
        event.deleteDeviceWithFailure(mosquittoError.message)
      );
      throw ServerError.internalServer(
        `Device deleted from database but failed to remove from Mosquitto: ${mosquittoError.message}`
      );
    }

    // 6. Emitir evento de éxito
    await EventService.emit(event.deleteDevice());

    // 7. Devolver resultado
    return deletedDevice;
  }
}
