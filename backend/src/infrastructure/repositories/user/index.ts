import "reflect-metadata";
import { container } from "tsyringe";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";

/**
 * Registra las dependencias relacionadas con usuarios
 *
 * - IUserRepository: Operaciones básicas sobre usuarios
 */
export function registerUserDependencies() {
  container.registerSingleton("IUserRepository", UserRepository);
}
