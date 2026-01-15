import { container } from "tsyringe";

// Infrastructure Repositories
import { registerAuthDependencies } from "./repositories/auth";
import { registerPasswordDependencies } from "./repositories/password";
import { registerBlacklistDependencies } from "./repositories/blacklist";
import { registerUserDependencies } from "./repositories/user";
import { registerUserCardDependencies } from "./repositories/user-card";
import { registerUserProfileDependencies } from "./repositories/user-profile";
import { registerRoleDependencies } from "./repositories/role";
import { registerSessionDependencies } from "./repositories/session";
import { registerTodoDependencies } from "./repositories/todo";
import { registerDeviceDependencies } from "./repositories/device";
import { registerProvisioningDependencies } from "./repositories/provisioning";
import { registerEventDependencies } from "./events";
import { registerMailerDependencies } from "./mailer";
import { registerRedisDependencies } from "./redis-server";

// Application Services
import { UserService } from "@application/services/UserService";
import { BlacklistService } from "@application/services/BlacklistService";
import { RoleService } from "@application/services/RoleService";

/**
 * Registra los servicios de Application
 * Estos son servicios ligeros usados por middlewares y helpers
 *
 * Nota: EventService NO se registra porque es un servicio estático
 */
function registerApplicationServices(): void {
  container.registerSingleton<UserService>(UserService);
  container.registerSingleton<BlacklistService>(BlacklistService);
  container.registerSingleton<RoleService>(RoleService);
}

export function registerAllDependencies() {
  // Servicios de Application
  registerApplicationServices();

  // Repositorios (Infrastructure)
  registerAuthDependencies();
  registerPasswordDependencies();
  registerBlacklistDependencies();
  registerUserDependencies();
  registerUserCardDependencies();
  registerUserProfileDependencies();
  registerRoleDependencies();
  registerSessionDependencies();
  registerTodoDependencies();
  registerDeviceDependencies();
  registerProvisioningDependencies();
  registerEventDependencies();

  // Servicios de Infrastructure
  registerMailerDependencies();
  registerRedisDependencies();
}
