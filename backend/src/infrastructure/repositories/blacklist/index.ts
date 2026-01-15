import "reflect-metadata";
import { container } from "tsyringe";
import { BlacklistRepository } from "./BlacklistRepository";

/**
 * Registra las dependencias relacionadas con blacklist
 *
 * - IBlacklistRepository: Operaciones de bloqueo/desbloqueo de usuarios
 *
 * Nota: Los Use Cases (AddUserToBlacklistUseCase, RemoveUserFromBlacklistUseCase)
 * se resuelven automáticamente gracias al decorador @injectable() y no necesitan registro manual.
 */
export function registerBlacklistDependencies() {
  container.registerSingleton("IBlacklistRepository", BlacklistRepository);
}
