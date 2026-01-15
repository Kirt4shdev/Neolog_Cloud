/**
 * Device interfaces para frontend
 */

export type DeviceStatus = "online" | "offline" | "unknown";

export type DeviceAction = "restart" | "sync_time" | "rotate_logs" | "request_status";

export interface Device {
  deviceId: string;
  serialNumber: string;
  macAddress: string;
  imei: string;
  license: string;
  status: DeviceStatus;
  lastSeenAt: string | null;
  firmwareVersion: string | null;
  hardwareVersion: string | null;
  latitude: number | null;
  longitude: number | null;
  locationUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListItem {
  deviceId: string;
  serialNumber: string;
  status: DeviceStatus;
  lastSeenAt: string | null;
  firmwareVersion: string | null;
  createdAt: string;
}

export interface DeviceTransmission {
  transmissionId: string;
  deviceId: string;
  topic: string;
  payload: string;
  messageType: "heartbeat" | "data" | "license" | "unknown";
  receivedAt: string;
}

export interface ProvisioningConfig {
  configId: string;
  isEnabled: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface SensorData {
  timestamp: string;
  [key: string]: any; // Sensor data es flexible
}
