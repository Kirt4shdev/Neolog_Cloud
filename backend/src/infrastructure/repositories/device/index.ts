import "reflect-metadata";
import { container } from "tsyringe";
import { DeviceRepository } from "./DeviceRepository";

/**
 * Registra las dependencias relacionadas con dispositivos Neologg
 *
 * - IDeviceRepository: Operaciones de provisión, listado y gestión de dispositivos
 *
 * Nota: Los Use Cases se resuelven automáticamente gracias al decorador @injectable()
 * y no necesitan registro manual.
 */
export function registerDeviceDependencies() {
  container.registerSingleton("IDeviceRepository", DeviceRepository);
}
