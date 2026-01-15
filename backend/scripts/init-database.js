const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Usar path absoluto para evitar problemas con Docker
const sqlFile = path.resolve(
  __dirname,
  "../src/infrastructure/database/sql/database.sql"
);

console.log("🚀 Iniciando proceso de creación de base de datos...\n");

// Paso 1: Generar el archivo database.sql
console.log("📝 Paso 1: Generando database.sql...");
try {
  execSync("node ./scripts/create-database.js", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
} catch (error) {
  console.error("❌ Error al generar database.sql");
  process.exit(1);
}

// Verificar que el archivo existe
if (!fs.existsSync(sqlFile)) {
  console.error("❌ Error: database.sql no fue generado");
  process.exit(1);
}

console.log("\n");

// Paso 2: Ejecutar el SQL en el contenedor Docker
console.log("🐳 Paso 2: Ejecutando SQL en contenedor Docker...\n");

const containerName = "neologg_cloud_postgres";
const dbUser = "postgres";
const dbName = "neologg_cloud_db";

try {
  // Verificar que el contenedor está corriendo
  console.log("   ⏳ Verificando contenedor Docker...");
  const containerCheck = execSync(
    `docker ps --filter "name=${containerName}" --format "{{.Names}}"`,
    { encoding: "utf8" }
  ).trim();

  if (!containerCheck.includes(containerName)) {
    console.error(
      `   ❌ Error: El contenedor '${containerName}' no está corriendo`
    );
    console.error("   💡 Ejecuta: npm run docker:up\n");
    process.exit(1);
  }
  console.log("   ✓ Contenedor activo\n");

  // Ejecutar el SQL directamente (sin copiar archivo)
  console.log("   ⏳ Ejecutando SQL en PostgreSQL...");
  const sqlContent = fs.readFileSync(sqlFile, "utf8");

  execSync(`docker exec -i ${containerName} psql -U ${dbUser} -d ${dbName}`, {
    input: sqlContent,
    stdio: ["pipe", "inherit", "inherit"],
  });

  console.log("\n✅ Base de datos inicializada exitosamente!\n");
  console.log("📊 Puedes verificar con:");
  console.log(
    `   docker exec -it ${containerName} psql -U ${dbUser} -d ${dbName}\n`
  );
} catch (error) {
  console.error("\n❌ Error al ejecutar SQL en el contenedor:");
  console.error(error.message);
  process.exit(1);
}
