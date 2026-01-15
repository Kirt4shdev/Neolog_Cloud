import { z } from "zod";

/**
 * ToggleProvisioningContract - Contrato para activar/desactivar provisioning
 * @property isEnabled - Si el provisioning debe estar habilitado
 * @property updatedBy - ID del admin que actualiza la configuración
 */
export const ToggleProvisioningContract = z.object({
  isEnabled: z.boolean({
    message: "isEnabled must be a boolean",
  }),
  updatedBy: z
    .string()
    .uuid({ message: "updatedBy must be a valid UUID" })
    .trim(),
});

export type ToggleProvisioningContract = z.infer<
  typeof ToggleProvisioningContract
>;
