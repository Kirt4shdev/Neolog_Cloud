# 📜 Scripts del Backend

Esta carpeta contiene scripts de utilidad para el backend.

---

## 📋 Scripts Disponibles

### 1. `create-database.js`

**Propósito:** Genera el archivo `database.sql` consolidado.

**Qué hace:**
- Lee todos los archivos SQL del proyecto
- Los combina en orden específico:
  1. Utils (enums, extensions, functions)
  2. Schema principal
  3. Índices y triggers
  4. Procedures (organizados por carpetas)
- Genera `/src/infrastructure/database/sql/database.sql`

**Uso:**

```bash
npm run database:create
```

**Orden de archivos:**

```
1. utils/enums.sql
2. utils/extensions.sql
3. utils/functions.sql
4. schema.sql
5. utils/index.sql
6. utils/triggers.sql
7. procedures/**/*.sql (recursivamente)
```

---

### 2. `init-database.js` ⭐

**Propósito:** Inicializa la base de datos en el contenedor Docker.

**Qué hace:**
1. Ejecuta `create-database.js` para generar `database.sql`
2. Verifica que el contenedor Docker está corriendo
3. Copia `database.sql` al contenedor
4. Ejecuta el SQL en PostgreSQL
5. Limpia archivos temporales

**Uso:**

```bash
npm run database:init
```

**Requisitos:**
- Contenedor `dilus-postgres` debe estar corriendo
- Docker debe estar instalado y accesible

**Verificación:**

```bash
# Listar tablas creadas
docker exec -it dilus-postgres psql -U postgres -d dilus_db -c "\dt"

# Listar funciones
docker exec -it dilus-postgres psql -U postgres -d dilus_db -c "\df"
```

---

### 3. `copy-package.js`

**Propósito:** Copia `package.json` al directorio de build.

**Uso:** Automático durante `npm run build`

---

### 4. `copy-env.js`

**Propósito:** Copia `.env` al directorio de build.

**Uso:** Automático durante `npm run build`

---

## 🔄 Flujo de Trabajo

### Desarrollo (Día a Día)

Si ya tienes la base de datos inicializada:

```bash
npm run dev
```

### Primera Configuración

Si es la primera vez o necesitas recrear la base de datos:

```bash
# 1. Levantar Docker
npm run docker:up

# 2. Inicializar base de datos
npm run database:init

# 3. Iniciar desarrollo
npm run dev
```

### Después de Cambios en SQL

Si modificaste archivos SQL (schema, procedures, etc.):

```bash
# Regenerar y ejecutar
npm run database:init
```

### Solo Generar SQL (Sin Ejecutar)

Si solo quieres ver el SQL generado:

```bash
# Genera database.sql pero no lo ejecuta
npm run database:create

# Ver el archivo generado
cat backend/src/infrastructure/database/sql/database.sql
```

---

## 🐛 Troubleshooting

### Error: "El contenedor 'dilus-postgres' no está corriendo"

**Solución:**

```bash
npm run docker:up
```

### Error: "database.sql no fue generado"

**Causa:** Falta algún archivo SQL requerido.

**Solución:** Verifica que existen todos los archivos listados en `create-database.js`:
- `utils/enums.sql`
- `utils/extensions.sql`
- `utils/functions.sql`
- `schema.sql`
- `utils/index.sql`
- `utils/triggers.sql`

### Error al ejecutar SQL

**Revisar logs:**

```bash
# Ver últimos logs de PostgreSQL
docker logs dilus-postgres --tail 50

# Conectar manualmente y probar
docker exec -it dilus-postgres psql -U postgres -d dilus_db
```

### Recrear base de datos desde cero

```bash
# 1. Detener contenedores y eliminar volúmenes
npm run docker:clean

# 2. Levantar de nuevo
npm run docker:up

# 3. Inicializar
npm run database:init
```

---

## 📊 Estructura del SQL Generado

El archivo `database.sql` generado tiene esta estructura:

```sql
-- ============================================================================
-- DATABASE FILE - AUTO-GENERATED
-- Generated at: 2026-01-12T14:30:00.000Z
-- ============================================================================

-- ============================================================================
-- UTILS/ENUMS.SQL
-- ============================================================================
...

-- ############################################################################
-- AUTH PROCEDURES
-- ############################################################################

-- ============================================================================
-- AUTH/LOGIN.SQL
-- ============================================================================
...
```

Cada sección está claramente delimitada para facilitar el debugging.

---

## 🔧 Personalización

### Agregar Nuevos Archivos al Orden

Edita `create-database.js`:

```javascript
const filesInOrder = [
  path.join(utilsDir, "enums.sql"),
  path.join(utilsDir, "extensions.sql"),
  path.join(utilsDir, "mi-nuevo-archivo.sql"), // ✨ Nuevo
  // ...
];
```

### Cambiar Nombre del Contenedor

Edita `init-database.js`:

```javascript
const containerName = "mi-postgres"; // Cambiar aquí
const dbUser = "postgres";
const dbName = "mi_db";
```

---

## 📚 Más Información

- [Guía Completa del Backend](../cursor-guide.md)
- [Guía de Docker](../../DOCKER.md)
- [Quick Start](../../QUICKSTART.md)
