const fs = require("fs");
const path = require("path");

// Rutas base
const sqlDir = path.join(__dirname, "../src/infrastructure/database/sql");
const utilsDir = path.join(sqlDir, "utils");
const proceduresDir = path.join(sqlDir, "procedures");
const outputFile = path.join(sqlDir, "database.sql");

// Orden de archivos a combinar
const filesInOrder = [
  // 1. Utils en orden específico
  path.join(utilsDir, "enums.sql"),
  path.join(utilsDir, "extensions.sql"),
  path.join(utilsDir, "functions.sql"),

  // 2. Schema principal
  path.join(sqlDir, "schema.sql"),

  // 3. Índices y triggers
  path.join(utilsDir, "index.sql"),
  path.join(utilsDir, "triggers.sql"),
];

// Función para leer un archivo y agregar separadores
function readFileWithSeparator(filePath, relativePath = null) {
  const fileName = path.basename(filePath);
  const displayPath = relativePath || fileName;
  const content = fs.readFileSync(filePath, "utf8").trim();

  return `
-- ============================================================================
-- ${displayPath.toUpperCase()}
-- ============================================================================

${content}

`;
}

// Función para leer recursivamente archivos SQL de un directorio
function readSqlFilesRecursively(dir, baseDir = dir) {
  let files = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Recursivamente leer subdirectorios
      files = files.concat(readSqlFilesRecursively(fullPath, baseDir));
    } else if (item.isFile() && item.name.endsWith(".sql")) {
      // Agregar archivo SQL con su ruta relativa
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fullPath,
        relativePath,
        dir: path.dirname(relativePath),
        name: item.name,
      });
    }
  }

  return files;
}

// Función principal
function createDatabaseFile() {
  console.log("🔧 Creando archivo database.sql...\n");

  let migrationContent = `-- ============================================================================
-- DATABASE FILE - AUTO-GENERATED
-- Generated at: ${new Date().toISOString()}
-- ============================================================================

`;

  // 1. Agregar archivos en orden específico
  filesInOrder.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      console.log(`✓ Agregando: ${path.relative(sqlDir, filePath)}`);
      migrationContent += readFileWithSeparator(filePath);
    } else {
      console.warn(
        `⚠ Archivo no encontrado: ${path.relative(sqlDir, filePath)}`
      );
    }
  });

  // 2. Agregar todos los procedures (recursivamente desde subcarpetas)
  console.log("\n📁 Agregando procedures:");
  if (fs.existsSync(proceduresDir)) {
    const procedureFiles = readSqlFilesRecursively(proceduresDir);

    // Ordenar por directorio y luego por nombre de archivo
    procedureFiles.sort((a, b) => {
      if (a.dir !== b.dir) {
        return a.dir.localeCompare(b.dir);
      }
      return a.name.localeCompare(b.name);
    });

    // Agrupar por directorio para agregar comentarios de sección
    let currentDir = null;
    procedureFiles.forEach((file) => {
      // Si cambiamos de directorio, agregar un comentario de sección
      if (currentDir !== file.dir) {
        currentDir = file.dir;
        const dirName = path.basename(file.dir).toUpperCase();
        migrationContent += `
-- ############################################################################
-- ${dirName} PROCEDURES
-- ############################################################################

`;
        console.log(`\n📂 ${dirName}:`);
      }

      console.log(`  ✓ ${file.relativePath}`);
      migrationContent += readFileWithSeparator(
        file.fullPath,
        file.relativePath
      );
    });
  }

  // 3. Escribir el archivo final
  fs.writeFileSync(outputFile, migrationContent, "utf8");

  console.log(`\n✅ Archivo database.sql creado exitosamente en:`);
  console.log(`   ${outputFile}\n`);
}

// Ejecutar
try {
  createDatabaseFile();
} catch (error) {
  console.error("❌ Error al crear el archivo database.sql:", error);
  process.exit(1);
}
