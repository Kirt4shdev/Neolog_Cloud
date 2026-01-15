import { database } from "@infrastructure/database/PostgresDatabase";
import { DeviceRepositoryErrorFactory } from "./DeviceRepositoryErrorFactory";
import {
  DeviceEntity,
  DeviceListEntity,
  ProvisionedDeviceEntity,
} from "@core/device/entities/DeviceEntity";
import {
  DeviceTransmissionEntity,
  DeviceActionEntity,
} from "@core/device/entities/DeviceTransmissionEntity";
import type { ProvisionDeviceContract } from "@core/device/contracts/ProvisionDeviceContract";
import type {
  GetDeviceDetailContract,
  SendDeviceActionContract,
} from "@core/device/contracts/DeviceContract";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";

export class DeviceRepository implements IDeviceRepository {
  public async provisionDevice(
    data: ProvisionDeviceContract & {
      license: string;
      rootPassword: string;
      mqttUsername: string;
      mqttPassword: string;
    }
  ): Promise<Result<ProvisionedDeviceEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM provision_device($1, $2, $3, $4, $5, $6, $7)",
      params: [
        data?.serialNumber,
        data?.macAddress,
        data?.imei,
        data?.license,
        data?.rootPassword,
        data?.mqttUsername,
        data?.mqttPassword,
      ],
      single: true,
      schema: ProvisionedDeviceEntity,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getDeviceList(): Promise<Result<DeviceListEntity[]>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_device_list()",
      params: [],
      single: false,
      schema: DeviceListEntity,
      isEmptyResponseAnError: false,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getDeviceDetail(
    data: GetDeviceDetailContract
  ): Promise<Result<DeviceEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_device_detail($1)",
      params: [data?.deviceId],
      single: true,
      schema: DeviceEntity,
      emptyResponseMessageError: "Device not found",
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async updateLastSeen(serialNumber: string): Promise<Result<void>> {
    const { error } = await database.query({
      query: "SELECT update_last_seen($1)",
      params: [serialNumber],
      single: true,
      isEmptyResponseAnError: false,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result: undefined };
  }

  public async updateDeviceStatus(
    serialNumber: string,
    status: "online" | "offline" | "unknown"
  ): Promise<Result<void>> {
    const { error } = await database.query({
      query: "SELECT update_device_status($1, $2)",
      params: [serialNumber, status],
      single: true,
      isEmptyResponseAnError: false,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result: undefined };
  }

  public async logTransmission(data: {
    serialNumber: string;
    topic: string;
    payload: string;
    messageType: "heartbeat" | "data" | "license" | "unknown";
  }): Promise<Result<DeviceTransmissionEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM log_transmission($1, $2, $3, $4)",
      params: [data?.serialNumber, data?.topic, data?.payload, data?.messageType],
      single: true,
      schema: DeviceTransmissionEntity,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async logAction(
    data: SendDeviceActionContract
  ): Promise<Result<DeviceActionEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM log_action($1, $2, $3, $4)",
      params: [data?.deviceId, data?.action, null, data?.requestedBy],
      single: true,
      schema: DeviceActionEntity,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getDeviceTransmissions(
    deviceId: string,
    limit: number = 50
  ): Promise<Result<DeviceTransmissionEntity[]>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_device_transmissions($1, $2)",
      params: [deviceId, limit],
      single: false,
      schema: DeviceTransmissionEntity,
      isEmptyResponseAnError: false,
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getDeviceBySerialNumber(
    serialNumber: string
  ): Promise<Result<{ deviceId: string }>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_device_by_serial_number($1)",
      params: [serialNumber],
      single: true,
      emptyResponseMessageError: "Device not found",
    });

    if (error) {
      return { error: new DeviceRepositoryErrorFactory(error).create() };
    }

    return { result: result as { deviceId: string } };
  }
}
