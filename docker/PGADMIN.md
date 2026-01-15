# 🗄️ Conectar a PostgreSQL con pgAdmin

Guía rápida para conectar pgAdmin al contenedor Docker de PostgreSQL.

---

## 🔌 Configuración de Conexión

### Paso 1: Abrir pgAdmin

Abre **pgAdmin 4** en tu computadora.

### Paso 2: Registrar Servidor

1. Click derecho en **"Servers"**
2. Selecciona **"Register" → "Server..."**

### Paso 3: Configurar

#### Pestaña "General"

```
Name: DILUS Docker
```

#### Pestaña "Connection"

```
Host name/address:    localhost
Port:                 5433
Maintenance database: dilus_db
Username:             postgres
Password:             postgres
```

**Opciones recomendadas:**
- ✅ Marca **"Save password"** para guardar la contraseña

### Paso 4: Guardar

Click en **"Save"** y listo! 🎉

---

## 📊 Credenciales de Conexión

| Campo | Valor |
|-------|-------|
| **Host** | `localhost` |
| **Puerto** | `5433` ⚠️ |
| **Base de datos** | `dilus_db` |
| **Usuario** | `postgres` |
| **Contraseña** | `postgres` |

> ⚠️ **Nota Importante:** El puerto es **5433** (no el estándar 5432) porque ya tienes PostgreSQL local en el puerto 5432.

---

## 🔍 Estructura de la Base de Datos

Una vez conectado, verás esta estructura en pgAdmin:

```
DILUS Docker
  └─ Databases (1)
      └─ dilus_db
          └─ Schemas (1)
              └─ public
                  ├─ Tables (9)
                  │   ├─ admins
                  │   ├─ blacklist
                  │   ├─ clients
                  │   ├─ events
                  │   ├─ password_recovery
                  │   ├─ sessions
                  │   ├─ tasks
                  │   ├─ user_cards
                  │   └─ users
                  │
                  ├─ Functions (23)
                  │   ├─ login(varchar, varchar)
                  │   ├─ register(varchar, varchar, varchar)
                  │   ├─ assign_role(uuid, uuid, varchar)
                  │   └─ ... más funciones
                  │
                  └─ Sequences, Indexes, Triggers, etc.
```

---

## 🎯 Consultas Útiles

### Ver todos los usuarios

```sql
SELECT user_id, name, email, created_at
FROM users
ORDER BY created_at DESC;
```

### Ver usuarios con roles

```sql
SELECT 
  u.name,
  u.email,
  CASE 
    WHEN a.admin_id IS NOT NULL THEN 'admin'
    WHEN c.client_id IS NOT NULL THEN 'client'
    ELSE 'sin rol'
  END as role
FROM users u
LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL;
```

### Ver sesiones activas

```sql
SELECT 
  s.session_id,
  u.name,
  u.email,
  s.created_at,
  s.last_activity
FROM sessions s
JOIN users u ON s.user_id = u.user_id
WHERE s.deleted_at IS NULL
ORDER BY s.last_activity DESC;
```

### Ver eventos recientes

```sql
SELECT 
  event_id,
  action,
  "table",
  endpoint,
  "method",
  "isSuccessful",
  "occurredAt"
FROM events
ORDER BY "occurredAt" DESC
LIMIT 50;
```

---

## 🛠 Herramientas de pgAdmin

### Query Tool

Para ejecutar queries:

1. Selecciona la base de datos `dilus_db`
2. Click en **"Query Tool"** (icono ⚡)
3. Escribe tu query
4. Click en **"Execute"** (F5)

### Ver datos de una tabla

1. Navega a la tabla (ej: `public → Tables → users`)
2. Click derecho → **"View/Edit Data" → "All Rows"**

### Ver definición de una función

1. Navega a la función (ej: `public → Functions → login`)
2. Click derecho → **"Properties" → "Code"**

---

## 🔄 Alternativas a pgAdmin

### DBeaver (Multiplataforma)

**Configuración:**

```
Host: localhost
Port: 5433
Database: dilis_db
Username: postgres
Password: postgres
```

[Descargar DBeaver](https://dbeaver.io/download/)

### DataGrip (JetBrains)

**Configuración igual que pgAdmin:**

```
Host: localhost
Port: 5433
Database: dilis_db
User: postgres
Password: postgres
```

[Descargar DataGrip](https://www.jetbrains.com/datagrip/)

### VS Code Extension

**PostgreSQL Extension:**

1. Instala la extensión "PostgreSQL" de Chris Kolkman
2. Agrega conexión:

```json
{
  "host": "localhost",
  "port": 5433,
  "database": "dilus_db",
  "user": "postgres",
  "password": "postgres"
}
```

---

## 🐛 Problemas Comunes

### No puedo conectarme

**Solución:**

```bash
# Verificar que el contenedor está corriendo
docker ps | grep postgres

# Si no está corriendo
npm run docker:up

# Ver logs
npm run docker:logs:postgres
```

### pgAdmin pide contraseña constantemente

**Solución:** Marca la opción **"Save password"** al crear la conexión.

### Error: "connection refused"

**Problema:** Estás usando el puerto incorrecto.

**Solución:** Asegúrate de usar el puerto **5433** (no 5432).

---

## 📚 Documentación Relacionada

- [Guía de Docker](./README.md)
- [Guía Completa de Docker](../DOCKER.md)
- [Scripts de Base de Datos](../backend/scripts/README.md)

---

## 💡 Tips

- Usa **Query Tool** para probar funciones SQL
- Explora las tablas para entender el modelo de datos
- Usa **"Refresh"** si no ves cambios recientes
- Los eventos se guardan en la tabla `events` (útil para auditoría)

---

¡Feliz exploración de la base de datos! 🚀
