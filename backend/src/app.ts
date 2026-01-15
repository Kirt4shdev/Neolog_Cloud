import "reflect-metadata";
import { registerAllDependencies } from "./infrastructure/registerAllDependencies";
import { ExpressServer } from "@presentation/ExpressServer";
import { redisServer } from "@infrastructure/redis-server";
import { database } from "@infrastructure/database/PostgresDatabase";
import { smtpEmailSender } from "@infrastructure/mailer";
import { influxDBService } from "@infrastructure/influxdb";
import { mqttService } from "@infrastructure/mqtt";
import { UnprotectedRouter } from "@presentation/routes/unprotected/UnprotectedRouter";
import { ApiRouter } from "@presentation/routes/ApiRouter";
import { httpRequestLogger } from "@presentation/middlewares/performance/httpRequestLogger";
import { GracefulShutdown } from "@shared/utils/GracefulShutdown";
import { runMigrationsOnStartup } from "@shared/utils/runMigrations";
// import TaskManager from "@infrastructure/schedulers/TaskManager";

registerAllDependencies();

(async () => {
  // Init Valkey (Redis) connection:
  // Nota: Se conecta al contenedor Docker definido en docker-compose.yml
  await redisServer.init();

  // Init database connection pool:
  // Nota: Se conecta al contenedor PostgreSQL definido en docker-compose.yml
  database.initPool();
  await database.isAlive();

  // Run database migrations:
  await runMigrationsOnStartup();

  // Init SMTP email sender:
  await smtpEmailSender.initTransporter();

  // Init InfluxDB v2 (Neologg Cloud):
  await influxDBService.init();

  // Init MQTT Service (Neologg Cloud):
  await mqttService.init();

  // Init Task Manager:
  // await TaskManager.init();

  // Init server:
  const server = new ExpressServer();
  const app = server.create();

  // HTTP request logger middleware
  app.use(httpRequestLogger);

  // Trust proxy to get real client IP address
  app.set("trust proxy", true);

  // Init server middlewares:
  app.use(server.initMiddlewares());

  // Init unprotected routes:
  app.use("/unprotected", UnprotectedRouter.init());

  // Init api routes:
  app.use("/api", ApiRouter.init());

  // Init 404 Not Found handler:
  app.use(server.notFoundHandler());

  // Init default error handler:
  app.use(server.defaultErrorHandler());

  // Server start:
  const serverInstance = app.listen(server.port, () => server.listenCallback());

  // Configurar graceful shutdown
  new GracefulShutdown(serverInstance)
    .addCleanupTask("database", () => database.close())
    .addCleanupTask("valkey", () => redisServer.close())
    .addCleanupTask("influxdb", () => influxDBService.close())
    .addCleanupTask("mqtt", () => mqttService.close())
    .listen();
})();
