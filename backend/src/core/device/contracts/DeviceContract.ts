import { z } from "zod";
import { DEVICE } from "@shared/constants/device";

/**
 * GetDeviceDetailContract - Contrato para obtener detalle de un dispositivo
 * @property deviceId - ID del dispositivo (UUID)
 */
export const GetDeviceDetailContract = z.object({
  deviceId: z.string().uuid({ message: "deviceId must be a valid UUID" }).trim(),
});

export type GetDeviceDetailContract = z.infer<typeof GetDeviceDetailContract>;

/**
 * SendDeviceActionContract - Contrato para enviar una acción a un dispositivo
 * @property deviceId - ID del dispositivo (UUID)
 * @property action - Acción a ejecutar
 * @property requestedBy - ID del admin que solicita la acción (UUID)
 */
export const SendDeviceActionContract = z.object({
  deviceId: z.string().uuid({ message: "deviceId must be a valid UUID" }).trim(),
  action: z.enum(DEVICE.ACTIONS, {
    message: `action must be one of: ${DEVICE.ACTIONS.join(", ")}`,
  }),
  requestedBy: z
    .string()
    .uuid({ message: "requestedBy must be a valid UUID" })
    .trim(),
});

export type SendDeviceActionContract = z.infer<typeof SendDeviceActionContract>;

/**
 * DeleteDeviceContract - Contrato para eliminar un dispositivo
 * @property deviceId - ID del dispositivo (UUID)
 */
export const DeleteDeviceContract = z.object({
  deviceId: z.string().uuid({ message: "deviceId must be a valid UUID" }).trim(),
});

export type DeleteDeviceContract = z.infer<typeof DeleteDeviceContract>;
