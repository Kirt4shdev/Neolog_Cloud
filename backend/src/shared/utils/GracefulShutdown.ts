import type { Server } from "http";

/**
 * GracefulShutdown - Manejo de cierre ordenado de la aplicación
 *
 * Captura señales de terminación (SIGTERM, SIGINT) y errores no manejados
 * para cerrar conexiones de manera ordenada antes de salir del proceso.
 *
 * @example
 * import { GracefulShutdown } from "@shared/utils/GracefulShutdown";
 *
 * const shutdown = new GracefulShutdown(serverInstance);
 * shutdown.addCleanupTask("database", () => database.close());
 * shutdown.addCleanupTask("redis", () => redisServer.close());
 * shutdown.listen();
 */
export class GracefulShutdown {
  private cleanupTasks: Map<string, () => Promise<void>> = new Map();

  constructor(private readonly server: Server) {}

  /**
   * Agrega una tarea de limpieza a ejecutar durante el shutdown
   * @param name - Nombre descriptivo de la tarea
   * @param task - Función async que ejecuta la limpieza
   */
  public addCleanupTask(name: string, task: () => Promise<void>): this {
    this.cleanupTasks.set(name, task);
    return this;
  }

  /**
   * Ejecuta el proceso de shutdown ordenado
   */
  private async shutdown(signal: string): Promise<void> {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // 1. Cerrar el servidor HTTP (dejar de aceptar nuevas conexiones)
    await new Promise<void>((resolve) => {
      this.server.close(() => {
        console.log("✓ HTTP server closed");
        resolve();
      });
    });

    // 2. Ejecutar tareas de limpieza en orden
    for (const [name, task] of this.cleanupTasks) {
      try {
        await task();
        console.log(`✓ ${name} closed`);
      } catch (error) {
        console.error(`✗ Error closing ${name}:`, error);
      }
    }

    console.log("Graceful shutdown completed");
    process.exit(0);
  }

  /**
   * Registra los listeners de eventos para shutdown
   */
  public listen(): void {
    // Capturar señales de terminación
    process.on("SIGTERM", () => this.shutdown("SIGTERM"));
    process.on("SIGINT", () => this.shutdown("SIGINT"));

    // Capturar errores no manejados
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      // No salir del proceso, solo loguear
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      this.shutdown("UNCAUGHT_EXCEPTION");
    });
  }
}
