import { z } from "zod";

/**
 * DeviceEntity - Entidad de dispositivo Neologg
 */
export const DeviceEntity = z.object({
  deviceId: z.string().uuid().trim(),
  serialNumber: z.string().trim(),
  macAddress: z.string().trim(),
  imei: z.string().trim(),
  license: z.string().trim(),
  rootPassword: z.string().trim(),
  mqttUsername: z.string().trim(),
  mqttPassword: z.string().trim(),
  status: z.enum(["online", "offline", "unknown"]),
  lastSeenAt: z.coerce.date().nullable(),
  firmwareVersion: z.string().trim().nullable(),
  hardwareVersion: z.string().trim().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  locationUpdatedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type DeviceEntity = z.infer<typeof DeviceEntity>;

/**
 * DeviceListEntity - Entidad simplificada para listados
 */
export const DeviceListEntity = z.object({
  deviceId: z.string().uuid().trim(),
  serialNumber: z.string().trim(),
  status: z.enum(["online", "offline", "unknown"]),
  lastSeenAt: z.coerce.date().nullable(),
  firmwareVersion: z.string().trim().nullable(),
  createdAt: z.coerce.date(),
});

export type DeviceListEntity = z.infer<typeof DeviceListEntity>;

/**
 * ProvisionedDeviceEntity - Entidad devuelta al provisionar
 * (NO incluye passwords por seguridad, solo metadatos públicos)
 */
export const ProvisionedDeviceEntity = z.object({
  deviceId: z.string().uuid().trim(),
  serialNumber: z.string().trim(),
  license: z.string().trim(),
  rootPassword: z.string().trim(),
  mqttUsername: z.string().trim(),
  mqttPassword: z.string().trim(),
});

export type ProvisionedDeviceEntity = z.infer<typeof ProvisionedDeviceEntity>;

/**
 * DeviceStatusEntity - Entidad simple para actualizaciones de estado MQTT
 */
export const DeviceStatusEntity = z.object({
  deviceId: z.string().uuid().trim(),
  serialNumber: z.string().trim(),
  status: z.string().trim(),
  lastSeenAt: z.coerce.date().nullable(),
});

export type DeviceStatusEntity = z.infer<typeof DeviceStatusEntity>;
