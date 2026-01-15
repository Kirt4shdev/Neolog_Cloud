import "reflect-metadata";
import { container } from "tsyringe";
import { RoleRepository } from "./RoleRepository";

/**
 * Registra las dependencias relacionadas con roles
 *
 * - IRoleRepository: Operaciones sobre roles de usuario
 *
 * Nota: Los Use Cases (AssignRoleUseCase, RemoveRoleUseCase) se resuelven
 * automáticamente gracias al decorador @injectable() y no necesitan registro manual.
 */
export function registerRoleDependencies() {
  container.registerSingleton("IRoleRepository", RoleRepository);
}
