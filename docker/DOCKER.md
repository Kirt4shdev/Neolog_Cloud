# 🐳 Guía de Docker - DILUS App Template

Esta guía explica cómo usar Docker para ejecutar los servicios de infraestructura del backend (PostgreSQL y Valkey).

---

## Requisitos Previos

- **Docker** instalado ([Descargar Docker Desktop](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (incluido en Docker Desktop)

---

## Servicios Disponibles

El archivo `docker/docker-compose.yml` define dos servicios:

### 1. PostgreSQL

- **Imagen:** `postgres:16-alpine`
- **Puerto:** `5432`
- **Usuario:** `postgres`
- **Password:** `postgres`
- **Base de datos:** `dilus_db`
- **Volumen:** `dilus-postgres-data` (persistencia de datos)

### 2. Valkey (Redis fork)

- **Imagen:** `valkey/valkey:8.1.3`
- **Puerto:** `6379`
- **Password:** `valkey_password`
- **Volumen:** `dilus-valkey-data` (persistencia de datos)
- **Configuración:** AOF (Append Only File) activado

---

## Comandos Rápidos

### Iniciar todos los servicios

```bash
npm run docker:up
# o
docker compose up -d
```

**¿Qué hace?**

- Levanta PostgreSQL y Valkey en segundo plano (`-d` = detached)
- Crea los volúmenes si no existen
- Crea la red `dilus-network`

### Detener todos los servicios

```bash
npm run docker:down
# o
docker compose down
```

**Importante:** Los datos se mantienen en los volúmenes.

### Reiniciar servicios

```bash
npm run docker:restart
# o
docker compose restart
```

### Ver logs en tiempo real

```bash
# Todos los servicios
npm run docker:logs

# Solo PostgreSQL
npm run docker:logs:postgres

# Solo Valkey
npm run docker:logs:valkey
```

### Limpiar todo (⚠️ BORRA LOS DATOS)

```bash
npm run docker:clean
# o
docker compose down -v
```

**Advertencia:** Esto elimina los volúmenes y todos los datos de la base de datos.

---

## Configuración del Backend

### 1. Crear archivo `.env`

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp backend/.env.example backend/.env
```

### 2. Verificar variables de entorno

Asegúrate de que estas variables apunten a los contenedores Docker:

```env
# PostgreSQL
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5432/dilus_db

# Valkey
VALKEY_HOST=localhost
VALKEY_PORT=6379
VALKEY_PASSWORD=valkey_password
```

### 3. Iniciar Docker y el backend

```bash
# 1. Levantar contenedores
npm run docker:up

# 2. Esperar a que estén listos (ver logs)
npm run docker:logs

# 3. Iniciar el backend
npm run dev:backend
```

---

## Flujo de Desarrollo

### Día a día

```bash
# 1. Levantar infraestructura (si no está corriendo)
npm run docker:up

# 2. Desarrollar
npm run dev

# 3. Al finalizar (opcional, los contenedores pueden quedarse corriendo)
npm run docker:down
```

### Primera vez

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd dilus-app-template

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env

# 4. Levantar infraestructura Docker
npm run docker:up

# 5. Crear la base de datos y ejecutar migraciones
npm run database:create

# 6. Iniciar el proyecto
npm run dev
```

---

## Troubleshooting

### Error: "Valkey connection timeout"

**Problema:** El backend no puede conectarse a Valkey.

**Solución:**

```bash
# Verificar que Valkey está corriendo
docker ps | grep valkey

# Si no está corriendo, iniciarlo
npm run docker:up

# Ver logs de Valkey
npm run docker:logs:valkey
```

### Error: "Database connection failed"

**Problema:** El backend no puede conectarse a PostgreSQL.

**Solución:**

```bash
# Verificar que PostgreSQL está corriendo
docker ps | grep postgres

# Si no está corriendo, iniciarlo
npm run docker:up

# Ver logs de PostgreSQL
npm run docker:logs:postgres

# Verificar que la base de datos existe
docker exec -it dilus-postgres psql -U postgres -l
```

### Puerto ya en uso

**Problema:** El puerto 5432 o 6379 ya está ocupado.

**Solución:**

**Opción 1: Cambiar el puerto en `docker/docker-compose.yml`**

```yaml
services:
  postgres:
    ports:
      - "5434:5432" # Usar puerto 5434 en el host
```

Luego actualiza tu `.env`:

```env
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5433/dilus_db
```

**Opción 2: Detener el servicio que usa el puerto**

```bash
# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5432 | xargs kill -9
```

### Reiniciar desde cero

Si algo no funciona, puedes reiniciar todo:

```bash
# 1. Detener y eliminar todo (incluidos volúmenes)
npm run docker:clean

# 2. Levantar de nuevo
npm run docker:up

# 3. Recrear la base de datos
npm run database:create

# 4. Iniciar el backend
npm run dev:backend
```

---

## Comandos Docker Avanzados

### Ejecutar comandos en los contenedores

**PostgreSQL:**

```bash
# Conectar a PostgreSQL con psql
docker exec -it dilus-postgres psql -U postgres -d dilus_db

# Inicializar/Reinicializar base de datos (recomendado)
npm run database:init

# Ejecutar SQL manualmente
docker exec -i dilus-postgres psql -U postgres -d dilus_db < backend/src/infrastructure/database/sql/database.sql

# Crear un backup
docker exec dilus-postgres pg_dump -U postgres dilus_db > backup.sql

# Restaurar un backup
docker exec -i dilus-postgres psql -U postgres dilus_db < backup.sql
```

**Valkey:**

```bash
# Conectar a Valkey CLI
docker exec -it dilus-valkey valkey-cli -a valkey_password

# Ver todas las keys
docker exec -it dilus-valkey valkey-cli -a valkey_password KEYS '*'

# Ver info del servidor
docker exec -it dilus-valkey valkey-cli -a valkey_password INFO
```

### Ver el estado de los servicios

```bash
# Ver contenedores corriendo
docker compose ps

# Ver uso de recursos
docker stats dilus-postgres dilus-valkey

# Ver información de volúmenes
docker volume ls | grep dilus
```

---

## Producción

Para producción, se recomienda:

1. **Usar Docker Secrets** para las contraseñas
2. **Configurar backups automáticos** de PostgreSQL
3. **Usar redes aisladas** entre servicios
4. **Configurar límites de recursos** (CPU, memoria)
5. **Habilitar SSL/TLS** para las conexiones

Ejemplo de `docker-compose.prod.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G

secrets:
  postgres_password:
    external: true
```

---

## Resumen de Scripts

| Comando                        | Descripción                       |
| ------------------------------ | --------------------------------- |
| `npm run docker:up`            | Inicia PostgreSQL y Valkey        |
| `npm run docker:down`          | Detiene los servicios             |
| `npm run docker:restart`       | Reinicia los servicios            |
| `npm run docker:logs`          | Ver logs de todos los servicios   |
| `npm run docker:logs:postgres` | Ver logs de PostgreSQL            |
| `npm run docker:logs:valkey`   | Ver logs de Valkey                |
| `npm run docker:clean`         | ⚠️ Elimina todo (incluidos datos) |

---

## 📚 Conectar con pgAdmin

Ver la guía completa: **[docker/PGADMIN.md](./docker/PGADMIN.md)**

**Configuración rápida:**

```
Host: localhost
Port: 5433
Database: dilus_db
User: postgres
Password: postgres
```

---

## Más Información

- **[docker/PGADMIN.md](./docker/PGADMIN.md)** - Guía de conexión con pgAdmin
- **[docker/README.md](./docker/README.md)** - Documentación de la carpeta Docker
- [Documentación Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Valkey GitHub](https://github.com/valkey-io/valkey)
