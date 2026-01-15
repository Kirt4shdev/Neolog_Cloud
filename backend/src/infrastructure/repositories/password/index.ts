import "reflect-metadata";
import { container } from "tsyringe";
import { PasswordRepository } from "./PasswordRepository";

/**
 * Registra las dependencias relacionadas con contraseñas
 *
 * - IPasswordRepository: Operaciones de recuperación y reseteo de contraseñas
 *
 * Nota: Los Use Cases (ForgotPasswordUseCase, ResetPasswordUseCase) se resuelven
 * automáticamente gracias al decorador @injectable() y no necesitan registro manual.
 */
export function registerPasswordDependencies() {
  container.registerSingleton("IPasswordRepository", PasswordRepository);
}
