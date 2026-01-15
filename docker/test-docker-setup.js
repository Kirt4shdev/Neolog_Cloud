/**
 * Script de verificación de Docker Setup
 *
 * Este script verifica que los contenedores Docker están corriendo
 * y que el backend puede conectarse a ellos.
 *
 * Uso: node test-docker-setup.js
 */

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

async function checkDockerInstalled() {
  try {
    await execAsync("docker --version");
    success("Docker está instalado");
    return true;
  } catch (err) {
    error("Docker no está instalado");
    info(
      "Instala Docker Desktop: https://www.docker.com/products/docker-desktop"
    );
    return false;
  }
}

async function checkDockerRunning() {
  try {
    await execAsync("docker ps");
    success("Docker está corriendo");
    return true;
  } catch (err) {
    error("Docker no está corriendo");
    warning("Inicia Docker Desktop");
    return false;
  }
}

async function checkPostgresContainer() {
  try {
    const { stdout } = await execAsync(
      'docker ps --filter "name=dilus-postgres" --format "{{.Names}}"'
    );
    if (stdout.includes("dilus-postgres")) {
      success("Contenedor PostgreSQL está corriendo");
      return true;
    } else {
      error("Contenedor PostgreSQL NO está corriendo");
      info("Ejecuta: npm run docker:up");
      return false;
    }
  } catch (err) {
    error("Error al verificar contenedor PostgreSQL");
    return false;
  }
}

async function checkValkeyContainer() {
  try {
    const { stdout } = await execAsync(
      'docker ps --filter "name=dilus-valkey" --format "{{.Names}}"'
    );
    if (stdout.includes("dilus-valkey")) {
      success("Contenedor Valkey está corriendo");
      return true;
    } else {
      error("Contenedor Valkey NO está corriendo");
      info("Ejecuta: npm run docker:up");
      return false;
    }
  } catch (err) {
    error("Error al verificar contenedor Valkey");
    return false;
  }
}

async function checkPostgresConnection() {
  try {
    const { stdout } = await execAsync(
      "docker exec dilus-postgres pg_isready -U postgres"
    );
    if (stdout.includes("accepting connections")) {
      success("PostgreSQL acepta conexiones");
      return true;
    } else {
      warning("PostgreSQL no está listo aún");
      info("Espera unos segundos e intenta de nuevo");
      return false;
    }
  } catch (err) {
    error("Error al verificar conexión PostgreSQL");
    return false;
  }
}

async function checkValkeyConnection() {
  try {
    await execAsync(
      "docker exec dilus-valkey valkey-cli -a valkey_password ping"
    );
    success("Valkey responde a PING");
    return true;
  } catch (err) {
    error("Error al verificar conexión Valkey");
    return false;
  }
}

async function checkDatabaseExists() {
  try {
    // Comando compatible con Windows (PowerShell) y Linux
    const { stdout } = await execAsync(
      'docker exec dilus-postgres psql -U postgres -lqt'
    );
    if (stdout.includes("dilus_db")) {
      success('Base de datos "dilus_db" existe');
      return true;
    } else {
      warning('Base de datos "dilus_db" NO existe');
      info("Ejecuta: npm run database:init");
      return false;
    }
  } catch (err) {
    error("Error al verificar base de datos");
    return false;
  }
}

async function checkEnvFile() {
  const fs = require("fs");
  const path = require("path");

  // Ir un nivel arriba desde la carpeta docker/
  const envPath = path.join(__dirname, "..", "backend", ".env");

  if (fs.existsSync(envPath)) {
    success("Archivo .env existe en backend/");
    return true;
  } else {
    error("Archivo .env NO existe en backend/");
    info("Ejecuta: cp backend/.env.example backend/.env");
    return false;
  }
}

async function main() {
  log("\n🐳 Verificando configuración de Docker...\n", colors.bright);

  const checks = [
    { name: "Docker instalado", fn: checkDockerInstalled },
    { name: "Docker corriendo", fn: checkDockerRunning },
    { name: "Contenedor PostgreSQL", fn: checkPostgresContainer },
    { name: "Contenedor Valkey", fn: checkValkeyContainer },
    { name: "Conexión PostgreSQL", fn: checkPostgresConnection },
    { name: "Conexión Valkey", fn: checkValkeyConnection },
    { name: "Base de datos", fn: checkDatabaseExists },
    { name: "Archivo .env", fn: checkEnvFile },
  ];

  let allPassed = true;

  for (const check of checks) {
    const result = await check.fn();
    if (!result) {
      allPassed = false;
    }
  }

  log("");

  if (allPassed) {
    log(
      "🎉 ¡Todo está configurado correctamente!",
      colors.green + colors.bright
    );
    log("\nPuedes iniciar el proyecto con:", colors.blue);
    log("  npm run dev\n", colors.bright);
  } else {
    log("❌ Hay problemas de configuración", colors.red + colors.bright);
    log(
      "\nSigue las instrucciones anteriores para resolver los problemas.\n",
      colors.yellow
    );
    log("Para más ayuda, consulta:", colors.blue);
    log("  - QUICKSTART.md", colors.bright);
    log("  - DOCKER.md\n", colors.bright);
    process.exit(1);
  }
}

main().catch((err) => {
  error("Error inesperado:");
  console.error(err);
  process.exit(1);
});
