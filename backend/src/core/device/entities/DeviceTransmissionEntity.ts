import { z } from "zod";

/**
 * DeviceTransmissionEntity - Entidad de transmisión MQTT
 */
export const DeviceTransmissionEntity = z.object({
  transmissionId: z.string().uuid().trim(),
  deviceId: z.string().uuid().trim(),
  topic: z.string().trim(),
  payload: z.string().nullable(),
  messageType: z.enum(["heartbeat", "data", "license", "unknown"]),
  receivedAt: z.coerce.date(),
});

export type DeviceTransmissionEntity = z.infer<typeof DeviceTransmissionEntity>;

/**
 * DeviceActionEntity - Entidad de acción enviada
 */
export const DeviceActionEntity = z.object({
  actionId: z.string().uuid().trim(),
  deviceId: z.string().uuid().trim(),
  action: z.enum(["restart", "sync_time", "rotate_logs", "request_status"]),
  payload: z.string().nullable(),
  requestedBy: z.string().uuid().trim(),
  requestedAt: z.coerce.date(),
});

export type DeviceActionEntity = z.infer<typeof DeviceActionEntity>;
