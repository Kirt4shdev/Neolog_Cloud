import "reflect-metadata";
import { container } from "tsyringe";
import { RedisServer } from "./RedisServer";
import { envs } from "@shared/envs";

// Crear instancia singleton de RedisServer
const redisServerInstance = new RedisServer({
  host: envs.VALKEY_HOST,
  port: Number(envs.VALKEY_PORT),
  password: envs.VALKEY_PASSWORD,
}).config();

/**
 * Registra las dependencias de Redis en el contenedor de DI
 */
export function registerRedisDependencies() {
  // Registrar la instancia singleton como ICacheService
  container.registerInstance("ICacheService", redisServerInstance);
}

// Exportar la instancia para inicialización en app.ts
export { redisServerInstance as redisServer };
