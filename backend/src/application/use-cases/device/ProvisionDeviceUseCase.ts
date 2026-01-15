import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { ProvisionDeviceContract } from "@core/device/contracts/ProvisionDeviceContract";
import { DeviceDomainEventFactory } from "@infrastructure/events/handlers/DeviceDomainEventFactory";
import { EventService } from "@application/services/EventService";
import { LicenseGenerator } from "@shared/utils/LicenseGenerator";
import { mosquittoService } from "@infrastructure/mosquitto";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";
import type { IProvisioningRepository } from "@core/provisioning/repositories/IProvisioningRepository";

@injectable()
export class ProvisionDeviceUseCase {
  constructor(
    @inject("IDeviceRepository")
    private readonly deviceRepository: IDeviceRepository,
    @inject("IProvisioningRepository")
    private readonly provisioningRepository: IProvisioningRepository
  ) {}

  public async execute(data: {
    contract: ProvisionDeviceContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    // 1. Inicializar evento
    const event = new DeviceDomainEventFactory({
      ip: ctx?.ip,
      metadata: { serialNumber: contract?.serialNumber },
    });

    // 2. Verificar que el provisioning esté habilitado
    const { result: provisioningConfig } =
      await this.provisioningRepository.getProvisioningStatus();

    if (!provisioningConfig?.isEnabled) {
      const errorMessage = "Provisioning is currently disabled";
      await EventService.emit(event.provisionDeviceWithFailure(errorMessage));
      throw ServerError.forbidden(errorMessage);
    }

    // 3. Validar datos de entrada
    const dto = DtoValidator.validate(ProvisionDeviceContract, contract);

    if (dto.error) {
      await EventService.emit(event.provisionDeviceWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid provision data";
      await EventService.emit(event.provisionDeviceWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // 4. Generar licencia y credenciales
    const license = LicenseGenerator.generateLicense(
      dto.result.serialNumber,
      dto.result.macAddress,
      dto.result.imei
    );

    const rootPassword = LicenseGenerator.generateRootPassword(
      dto.result.serialNumber
    );

    const mqttUsername = LicenseGenerator.generateMqttUsername(
      dto.result.serialNumber
    );

    const mqttPassword = LicenseGenerator.generateMqttPassword(
      dto.result.serialNumber,
      dto.result.imei
    );

    // 5. Provisionar dispositivo en Mosquitto
    const { error: mosquittoError } = await mosquittoService.provisionDevice(
      mqttUsername,
      mqttPassword
    );

    if (mosquittoError) {
      await EventService.emit(
        event.provisionDeviceWithFailure(mosquittoError.message)
      );
      throw ServerError.internalServer(
        `Failed to provision device in Mosquitto: ${mosquittoError.message}`
      );
    }

    // 6. Registrar dispositivo en la base de datos
    const { error: repositoryError, result: repositoryResult } =
      await this.deviceRepository.provisionDevice({
        ...dto.result,
        license,
        rootPassword,
        mqttUsername,
        mqttPassword,
      });

    if (repositoryError) {
      await EventService.emit(
        event.provisionDeviceWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    // 7. Emitir evento de éxito
    await EventService.emit(event.provisionDevice());

    // 8. Devolver resultado
    return repositoryResult;
  }
}
