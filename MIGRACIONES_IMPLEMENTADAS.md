# Sistema de Migraciones de Base de Datos - Implementado

## ✅ **Lo que se ha implementado:**

### 1. **Inicialización Automática de Base de Datos**
- **Ubicación**: `backend/src/infrastructure/database/sql/init/`
- **Archivo**: `01-database.sql`
- **Funcionamiento**: 
  - PostgreSQL ejecuta automáticamente todos los archivos `.sql` en `/docker-entrypoint-initdb.d` al crear el contenedor por primera vez
  - El `docker-compose.yml` monta `../backend/src/infrastructure/database/sql/init` en `/docker-entrypoint-initdb.d`
  - El script `create-database.js` ahora genera automáticamente el archivo `01-database.sql` en el directorio `init`

### 2. **Sistema de Migraciones**
- **Ubicación**: `backend/src/infrastructure/database/sql/migrations/`
- **Script Manual**: `backend/scripts/run-migrations.js`
- **Script Automático**: `backend/src/shared/utils/runMigrations.ts`
- **Comando**: `npm run database:migrate` (manual)
- **Funcionamiento Automático**: 
  - Al arrancar el backend, se ejecuta automáticamente `runMigrationsOnStartup()`
  - Crea la tabla `schema_migrations` si no existe
  - Verifica qué migraciones ya se ejecutaron
  - Ejecuta solo las migraciones pendientes
  - Registra cada migración ejecutada

### 3. **Tabla de Control de Migraciones**
```sql
CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4. **Nomenclatura de Migraciones**
- **Formato**: `YYYYMMDDHHMMSS_descripcion.sql`
- **Ejemplo**: `20260115120000_add_delete_device_procedure.sql`
- **Orden**: Las migraciones se ejecutan en orden alfabético (por timestamp)

### 5. **Scripts Creados**

#### `backend/scripts/create-database.js`
- Genera el archivo `database.sql` combinando todos los archivos SQL
- **NUEVO**: Copia automáticamente el archivo generado a `init/01-database.sql`

#### `backend/scripts/run-migrations.js`
- Ejecuta migraciones manualmente
- Verifica el contenedor Docker
- Crea la tabla `schema_migrations`
- Ejecuta migraciones pendientes
- Registra cada migración

#### `backend/src/shared/utils/runMigrations.ts`
- **NUEVO**: Ejecuta migraciones automáticamente al arrancar el backend
- Integrado en `app.ts`
- No detiene el servidor si falla (solo registra el error)

### 6. **Comandos Disponibles**

```bash
# Generar database.sql y copiarlo a init/
npm run database:create

# Inicializar la base de datos manualmente (ejecuta database.sql)
npm run database:init

# Ejecutar migraciones pendientes manualmente
npm run database:migrate

# Ver migraciones ejecutadas
docker exec neologg_cloud_postgres psql -U postgres -d neologg_cloud_db -c "SELECT * FROM schema_migrations ORDER BY executed_at DESC"
```

### 7. **Flujo de Trabajo**

#### **Primera vez (contenedor nuevo)**:
1. Docker crea el contenedor PostgreSQL
2. PostgreSQL ejecuta automáticamente `01-database.sql` de `/docker-entrypoint-initdb.d`
3. Se crea el esquema completo (tablas, funciones, triggers, procedures)
4. El backend arranca y verifica migraciones pendientes

#### **Arranque normal**:
1. El backend arranca
2. Ejecuta `runMigrationsOnStartup()`
3. Verifica si hay migraciones pendientes en el directorio `migrations/`
4. Ejecuta solo las que no están en `schema_migrations`
5. Continúa con el arranque normal

#### **Crear una nueva migración**:
1. Crea un archivo en `backend/src/infrastructure/database/sql/migrations/`
2. Usa el formato: `YYYYMMDDHHMMSS_descripcion.sql`
3. Escribe tu SQL (puede ser DDL o DML)
4. Opción A: Reinicia el backend (se ejecutará automáticamente)
5. Opción B: Ejecuta `npm run database:migrate` (manual)

### 8. **Ejemplo de Migración**

```sql
-- 20260115120000_add_user_avatar_column.sql

-- Agregar nueva columna
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_users_avatar ON users(avatar_url) WHERE avatar_url IS NOT NULL;

-- Comentario
COMMENT ON COLUMN users.avatar_url IS 'URL del avatar del usuario';
```

### 9. **Archivos Modificados**

- ✅ `backend/scripts/create-database.js` - Copia a init/
- ✅ `backend/scripts/run-migrations.js` - Script manual de migraciones
- ✅ `backend/src/shared/utils/runMigrations.ts` - Migraciones automáticas
- ✅ `backend/src/app.ts` - Integración de migraciones
- ✅ `backend/package.json` - Comando `database:migrate`
- ✅ `docker/docker-compose.yml` - Montaje de directorio init/
- ✅ `backend/src/infrastructure/database/sql/database.sql` - Incluye `delete_device`
- ✅ `backend/src/infrastructure/database/sql/init/01-database.sql` - Auto-generado

### 10. **Ventajas del Sistema**

✅ **Automático**: Las migraciones se ejecutan al arrancar el backend
✅ **Idempotente**: No se ejecuta dos veces la misma migración
✅ **Control**: Tabla `schema_migrations` registra todo
✅ **Manual**: También se puede ejecutar `npm run database:migrate`
✅ **Seguro**: No detiene el servidor si falla una migración
✅ **Documentado**: README en el directorio migrations/
✅ **Ordenado**: Timestamp en el nombre asegura el orden
✅ **Transparente**: Logs en DEBUG muestran el progreso

### 11. **Procedimiento `delete_device` Agregado**

✅ El procedimiento SQL `delete_device` está incluido en `database.sql`
✅ Se creará automáticamente en nuevas instalaciones
✅ Ya está ejecutado en tu base de datos actual
✅ El frontend puede eliminar dispositivos correctamente

### 12. **Próximos Pasos**

Para crear una nueva funcionalidad que requiera cambios en la DB:

1. **Crea la migración**: `backend/src/infrastructure/database/sql/migrations/20260116HHMMSS_tu_descripcion.sql`
2. **Escribe el SQL**: Puede ser CREATE, ALTER, DROP, INSERT, UPDATE, etc.
3. **Reinicia el backend**: La migración se ejecutará automáticamente
4. **Verifica**: Revisa los logs para confirmar que se ejecutó correctamente

---

## 🎉 **Sistema Completo y Funcionando**

El sistema ahora tiene:
- ✅ Inicialización automática de DB en contenedores nuevos
- ✅ Migraciones automáticas al arrancar el backend
- ✅ Control de versiones de la base de datos
- ✅ Procedimiento `delete_device` implementado y funcionando
- ✅ Frontend con botón de eliminación y confirmación

**Fecha de implementación**: 2026-01-15
