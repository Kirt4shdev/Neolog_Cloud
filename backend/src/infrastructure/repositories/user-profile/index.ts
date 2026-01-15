import "reflect-metadata";
import { container } from "tsyringe";
import { UserProfileRepository } from "./UserProfileRepository";

/**
 * Registra las dependencias relacionadas con perfiles de usuario
 *
 * - IUserProfileRepository: Operaciones que combinan User y UserCard
 */
export function registerUserProfileDependencies() {
  container.registerSingleton("IUserProfileRepository", UserProfileRepository);
}
