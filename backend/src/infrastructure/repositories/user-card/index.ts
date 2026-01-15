import "reflect-metadata";
import { container } from "tsyringe";
import { UserCardRepository } from "@infrastructure/repositories/user-card/UserCardRepository";

/**
 * Registra las dependencias relacionadas con tarjetas de usuario
 *
 * - IUserCardRepository: Operaciones CRUD sobre tarjetas de usuario
 */
export function registerUserCardDependencies() {
  container.registerSingleton("IUserCardRepository", UserCardRepository);
}
