import "reflect-metadata";
import { container } from "tsyringe";
import { AuthRepository } from "./AuthRepository";

/**
 * Registra las dependencias relacionadas con autenticación
 *
 * - IAuthRepository: Operaciones de login y registro
 *
 * Nota: Los Use Cases (LoginUseCase, RegisterUseCase) se resuelven
 * automáticamente gracias al decorador @injectable() y no necesitan registro manual.
 */
export function registerAuthDependencies() {
  container.registerSingleton("IAuthRepository", AuthRepository);
}
