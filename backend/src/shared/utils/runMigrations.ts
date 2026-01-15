import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { Debug } from "@shared/utils/Debug";

/**
 * Ejecuta las migraciones de base de datos automáticamente
 */
export async function runMigrationsOnStartup(): Promise<void> {
  const migrationsDir = path.resolve(
    __dirname,
    "../infrastructure/database/sql/migrations"
  );
  const containerName = process.env.POSTGRES_CONTAINER_NAME || "neologg_cloud_postgres";
  const dbUser = process.env.POSTGRES_USER || "postgres";
  const dbName = process.env.POSTGRES_DB || "neologg_cloud_db";

  Debug.info("Checking for pending migrations...");

  // Verificar que el directorio de migraciones existe
  if (!fs.existsSync(migrationsDir)) {
    Debug.warning("Migrations directory not found, skipping migrations");
    return;
  }

  try {
    // Crear tabla de control de migraciones si no existe
    const createMigrationsTableSQL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

    execSync(
      `docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`,
      {
        input: createMigrationsTableSQL,
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

    // Obtener migraciones ya ejecutadas
    const result = execSync(
      `docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName} -t -c "SELECT filename FROM schema_migrations ORDER BY filename"`,
      { encoding: "utf8" }
    );
    
    const executedMigrations = result
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Leer archivos de migraciones pendientes
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const pendingMigrations = migrationFiles.filter(
      (file) => !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      Debug.info("No pending migrations");
      return;
    }

    Debug.info(`Found ${pendingMigrations.length} pending migration(s)`);

    // Ejecutar cada migración pendiente
    for (const migration of pendingMigrations) {
      const migrationPath = path.join(migrationsDir, migration);
      Debug.info(`Applying migration: ${migration}`);

      try {
        // Leer el contenido de la migración
        const sqlContent = fs.readFileSync(migrationPath, "utf8");

        // Ejecutar la migración
        execSync(
          `docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`,
          {
            input: sqlContent,
            stdio: ["pipe", "pipe", "pipe"],
          }
        );

        // Registrar la migración como ejecutada
        const registerSQL = `INSERT INTO schema_migrations (filename) VALUES ('${migration}');`;
        execSync(
          `docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`,
          {
            input: registerSQL,
            stdio: ["pipe", "pipe", "pipe"],
          }
        );

        Debug.success(`Migration applied: ${migration}`);
      } catch (error: any) {
        Debug.error(`Failed to apply migration ${migration}: ${error.message}`);
        throw error;
      }
    }

    Debug.success("All migrations applied successfully");
  } catch (error: any) {
    Debug.error(`Migration error: ${error.message}`);
    // No lanzamos el error para no detener el inicio del servidor
    // pero lo registramos para que se vea en los logs
  }
}
