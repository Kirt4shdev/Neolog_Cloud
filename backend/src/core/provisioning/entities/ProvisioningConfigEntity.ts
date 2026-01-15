import { z } from "zod";

/**
 * ProvisioningConfigEntity - Entidad de configuración de provisioning
 */
export const ProvisioningConfigEntity = z.object({
  configId: z.string().uuid().trim(),
  isEnabled: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  updatedBy: z.string().uuid().trim().nullable(),
});

export type ProvisioningConfigEntity = z.infer<typeof ProvisioningConfigEntity>;
