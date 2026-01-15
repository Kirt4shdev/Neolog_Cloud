import type { ProvisionDeviceContract } from "../contracts/ProvisionDeviceContract";
import type {
  SendDeviceActionContract,
  GetDeviceDetailContract,
  DeleteDeviceContract,
} from "../contracts/DeviceContract";
import type {
  DeviceEntity,
  DeviceListEntity,
  ProvisionedDeviceEntity,
} from "../entities/DeviceEntity";
import type {
  DeviceTransmissionEntity,
  DeviceActionEntity,
} from "../entities/DeviceTransmissionEntity";

/**
 * IDeviceRepository - Interfaz de repositorio de dispositivos
 */
export interface IDeviceRepository {
  /**
   * Aprovisiona un nuevo dispositivo en el sistema
   * @param data - Datos de provisionamiento
   * @returns Promise<Result<ProvisionedDeviceEntity>>
   */
  provisionDevice(
    data: ProvisionDeviceContract & {
      license: string;
      rootPassword: string;
      mqttUsername: string;
      mqttPassword: string;
    }
  ): Promise<Result<ProvisionedDeviceEntity>>;

  /**
   * Obtiene el listado de todos los dispositivos
   * @returns Promise<Result<DeviceListEntity[]>>
   */
  getDeviceList(): Promise<Result<DeviceListEntity[]>>;

  /**
   * Obtiene el detalle de un dispositivo específico
   * @param data - ID del dispositivo
   * @returns Promise<Result<DeviceEntity>>
   */
  getDeviceDetail(data: GetDeviceDetailContract): Promise<Result<DeviceEntity>>;

  /**
   * Actualiza el lastSeenAt de un dispositivo (heartbeat)
   * @param serialNumber - Serial Number del dispositivo
   * @returns Promise<Result<void>>
   */
  updateLastSeen(serialNumber: string): Promise<Result<void>>;

  /**
   * Actualiza el estado del dispositivo
   * @param serialNumber - Serial Number del dispositivo
   * @param status - Nuevo estado
   * @returns Promise<Result<void>>
   */
  updateDeviceStatus(
    serialNumber: string,
    status: "online" | "offline" | "unknown"
  ): Promise<Result<void>>;

  /**
   * Registra una transmisión MQTT recibida
   * @param data - Datos de la transmisión
   * @returns Promise<Result<DeviceTransmissionEntity>>
   */
  logTransmission(data: {
    serialNumber: string;
    topic: string;
    payload: string;
    messageType: "heartbeat" | "data" | "license" | "unknown";
  }): Promise<Result<DeviceTransmissionEntity>>;

  /**
   * Registra una acción enviada a un dispositivo
   * @param data - Datos de la acción
   * @returns Promise<Result<DeviceActionEntity>>
   */
  logAction(
    data: SendDeviceActionContract
  ): Promise<Result<DeviceActionEntity>>;

  /**
   * Obtiene las últimas transmisiones de un dispositivo
   * @param deviceId - ID del dispositivo
   * @param limit - Número máximo de transmisiones a obtener
   * @returns Promise<Result<DeviceTransmissionEntity[]>>
   */
  getDeviceTransmissions(
    deviceId: string,
    limit?: number
  ): Promise<Result<DeviceTransmissionEntity[]>>;

  /**
   * Verifica si un dispositivo existe por serial number
   * @param serialNumber - Serial Number del dispositivo
   * @returns Promise<Result<{ deviceId: string }>>
   */
  getDeviceBySerialNumber(
    serialNumber: string
  ): Promise<Result<{ deviceId: string }>>;

  /**
   * Elimina un dispositivo del sistema
   * @param data - ID del dispositivo a eliminar
   * @returns Promise<Result<DeviceListEntity>>
   */
  deleteDevice(data: DeleteDeviceContract): Promise<Result<DeviceListEntity>>;
}
