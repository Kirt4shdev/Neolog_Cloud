import "reflect-metadata";
import { container } from "tsyringe";
import { ProvisioningRepository } from "./ProvisioningRepository";

/**
 * Registra las dependencias relacionadas con provisioning de Neologg
 *
 * - IProvisioningRepository: Operaciones de configuración de provisioning
 *
 * Nota: Los Use Cases se resuelven automáticamente gracias al decorador @injectable()
 * y no necesitan registro manual.
 */
export function registerProvisioningDependencies() {
  container.registerSingleton("IProvisioningRepository", ProvisioningRepository);
}
