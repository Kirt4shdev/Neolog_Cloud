const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Configuración
const migrationsDir = path.resolve(
  __dirname,
  "../src/infrastructure/database/sql/migrations"
);
const containerName = "neologg_cloud_postgres";
const dbUser = "postgres";
const dbName = "neologg_cloud_db";

console.log("🔄 Ejecutando migraciones de base de datos...\n");

// Verificar que el directorio de migraciones existe
if (!fs.existsSync(migrationsDir)) {
  console.log("📁 No existe el directorio de migraciones, creándolo...");
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log("✅ Directorio creado\n");
}

// Verificar que el contenedor está corriendo
try {
  console.log("⏳ Verificando contenedor Docker...");
  const containerCheck = execSync(
    `docker ps --filter "name=${containerName}" --format "{{.Names}}"`,
    { encoding: "utf8" }
  ).trim();

  if (!containerCheck.includes(containerName)) {
    console.error(
      `❌ Error: El contenedor '${containerName}' no está corriendo`
    );
    console.error("💡 Ejecuta: npm run docker:up\n");
    process.exit(1);
  }
  console.log("✓ Contenedor activo\n");
} catch (error) {
  console.error("❌ Error al verificar el contenedor:", error.message);
  process.exit(1);
}

// Crear tabla de control de migraciones si no existe
console.log("📋 Verificando tabla de migraciones...");
const createMigrationsTableSQL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

try {
  execSync(
    `docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`,
    {
      input: createMigrationsTableSQL,
      stdio: ["pipe", "pipe", "inherit"],
    }
  );
  console.log("✓ Tabla schema_migrations verificada\n");
} catch (error) {
  console.error("❌ Error al crear tabla de migraciones:", error.message);
  process.exit(1);
}

// Obtener migraciones ya ejecutadas
console.log("🔍 Obteniendo migraciones ejecutadas...");
let executedMigrations = [];
try {
  const result = execSync(
    `docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName} -t -c "SELECT filename FROM schema_migrations ORDER BY filename"`,
    { encoding: "utf8" }
  );
  executedMigrations = result
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  console.log(`✓ ${executedMigrations.length} migraciones ya ejecutadas\n`);
} catch (error) {
  console.error("❌ Error al obtener migraciones:", error.message);
  process.exit(1);
}

// Leer archivos de migraciones pendientes
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const pendingMigrations = migrationFiles.filter(
  (file) => !executedMigrations.includes(file)
);

if (pendingMigrations.length === 0) {
  console.log("✅ No hay migraciones pendientes\n");
  process.exit(0);
}

console.log(`📝 Migraciones pendientes: ${pendingMigrations.length}\n`);

// Ejecutar cada migración pendiente
let successCount = 0;
let errorCount = 0;

for (const migration of pendingMigrations) {
  const migrationPath = path.join(migrationsDir, migration);
  console.log(`⏳ Ejecutando: ${migration}`);

  try {
    // Leer el contenido de la migración
    const sqlContent = fs.readFileSync(migrationPath, "utf8");

    // Ejecutar la migración
    execSync(`docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`, {
      input: sqlContent,
      stdio: ["pipe", "pipe", "inherit"],
    });

    // Registrar la migración como ejecutada
    const registerSQL = `INSERT INTO schema_migrations (filename) VALUES ('${migration}');`;
    execSync(`docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`, {
      input: registerSQL,
      stdio: ["pipe", "pipe", "inherit"],
    });

    console.log(`   ✓ ${migration} ejecutada correctamente`);
    successCount++;
  } catch (error) {
    console.error(`   ❌ Error en ${migration}`);
    errorCount++;
  }
}

console.log("\n" + "=".repeat(50));
console.log(`✅ Migraciones completadas: ${successCount}`);
if (errorCount > 0) {
  console.log(`❌ Migraciones con errores: ${errorCount}`);
}
console.log("=".repeat(50) + "\n");

if (errorCount > 0) {
  process.exit(1);
}
