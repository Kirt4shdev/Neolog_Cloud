# Sistema de Migraciones de Base de Datos

Este directorio contiene las migraciones SQL que se aplican automáticamente a la base de datos.

## Nomenclatura

Los archivos de migración deben seguir el formato:

```
YYYYMMDDHHMMSS_descripcion.sql
```

Ejemplo:
- `20260115120000_add_delete_device_procedure.sql`
- `20260115130000_add_user_notifications_table.sql`

## ¿Cómo crear una migración?

1. Crea un nuevo archivo en este directorio con el nombre siguiendo la nomenclatura
2. Escribe tu SQL (puede incluir múltiples statements)
3. Ejecuta `npm run database:migrate` para aplicar las migraciones pendientes

## Control de Migraciones

El sistema mantiene una tabla `schema_migrations` que registra qué migraciones ya se han ejecutado. Esto evita que se ejecuten dos veces.

## Ejemplo de Migración

```sql
-- Ejemplo: Agregar una nueva columna
ALTER TABLE devices ADD COLUMN IF NOT EXISTS notes TEXT;

-- Crear un índice
CREATE INDEX IF NOT EXISTS idx_devices_notes ON devices(notes);
```

## Comandos disponibles

```bash
# Ejecutar migraciones pendientes
npm run database:migrate

# Ver migraciones ejecutadas
docker exec neologg_cloud_postgres psql -U postgres -d neologg_cloud_db -c "SELECT * FROM schema_migrations ORDER BY executed_at DESC"
```

## Notas importantes

- Las migraciones se ejecutan en orden alfabético (por eso usamos timestamp)
- Una vez ejecutada, una migración no se puede modificar
- Si necesitas revertir un cambio, crea una nueva migración
- Usa `IF EXISTS` / `IF NOT EXISTS` para hacer las migraciones idempotentes
