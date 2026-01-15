import "reflect-metadata";
import { container } from "tsyringe";
import { SessionRepository } from "./SessionRepository";

/**
 * Registra las dependencias relacionadas con sesiones
 *
 * - ISessionRepository: Operaciones CRUD sobre sesiones de usuario
 *
 * Nota: Los Use Cases relacionados con sesiones se resuelven
 * automáticamente gracias al decorador @injectable() y no necesitan registro manual.
 */
export function registerSessionDependencies() {
  container.registerSingleton("ISessionRepository", SessionRepository);
}
