import { z } from "zod";
import { DEVICE } from "@shared/constants/device";

/**
 * ProvisionDeviceContract - Contrato para aprovisionar un nuevo dispositivo
 * @property serialNumber - Serial Number del dispositivo
 * @property macAddress - MAC Address del dispositivo
 * @property imei - IMEI del dispositivo
 */
export const ProvisionDeviceContract = z.object({
  serialNumber: z
    .string({ message: "serialNumber is required" })
    .trim()
    .min(DEVICE.SN_MIN_LENGTH, {
      message: `serialNumber must be at least ${DEVICE.SN_MIN_LENGTH} characters`,
    })
    .max(DEVICE.SN_MAX_LENGTH, {
      message: `serialNumber must be at most ${DEVICE.SN_MAX_LENGTH} characters`,
    }),
  macAddress: z
    .string({ message: "macAddress is required" })
    .trim()
    .min(DEVICE.MAC_MIN_LENGTH, {
      message: `macAddress must be at least ${DEVICE.MAC_MIN_LENGTH} characters`,
    })
    .max(DEVICE.MAC_MAX_LENGTH, {
      message: `macAddress must be at most ${DEVICE.MAC_MAX_LENGTH} characters`,
    })
    .regex(/^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$/, {
      message: "Invalid MAC address format",
    }),
  imei: z
    .string({ message: "imei is required" })
    .trim()
    .length(DEVICE.IMEI_MIN_LENGTH, {
      message: `imei must be exactly ${DEVICE.IMEI_MIN_LENGTH} characters`,
    })
    .regex(/^\d+$/, {
      message: "imei must contain only digits",
    }),
});

export type ProvisionDeviceContract = z.infer<typeof ProvisionDeviceContract>;
