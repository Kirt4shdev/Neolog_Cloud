# 🐳 Docker Configuration

Esta carpeta contiene **toda la configuración de Docker** para el proyecto.

---

## 📁 Estructura de Archivos

```
docker/
├── docker-compose.yml      # ⚙️ Configuración de servicios
├── test-docker-setup.js    # ✅ Script de verificación automática
├── .dockerignore           # 🚫 Archivos a ignorar en builds
├── README.md               # 📖 Este archivo
├── PGADMIN.md              # 🗄️ Guía de conexión con pgAdmin
├── STRUCTURE.md            # 📂 Estructura de archivos
├── CHANGELOG.md            # 📝 Historial de cambios
└── TROUBLESHOOTING.md      # 🔧 Soluciones a problemas
```

---

## 📋 Descripción de Archivos

### `docker-compose.yml`

Archivo de configuración de Docker Compose que define:

- **PostgreSQL 16** - Base de datos relacional (puerto 5433)
- **Valkey 8.1.3** - Cache y sesiones (puerto 6379)
- Volúmenes persistentes
- Health checks
- Red compartida

### `test-docker-setup.js`

Script de verificación que comprueba:

- ✅ Docker instalado y corriendo
- ✅ Contenedores activos
- ✅ Conexiones a PostgreSQL y Valkey
- ✅ Base de datos creada
- ✅ Archivo `.env` configurado

**Uso:** `npm run docker:check`

### `.dockerignore`

Lista de archivos y carpetas que Docker debe ignorar al construir imágenes.

### `.env.docker`

Variables de entorno para los contenedores Docker (credenciales, puertos, etc.).

### `PGADMIN.md`

Guía completa para conectar herramientas de administración de bases de datos:
- pgAdmin 4
- DBeaver
- DataGrip
- VS Code Extension

### `TROUBLESHOOTING.md`

Soluciones a problemas comunes:
- Errores de autenticación
- Puertos en uso
- Contenedores que no inician
- Problemas de conexión
- Y más...

---

## 🚀 Comandos Disponibles

Todos los comandos se ejecutan desde la **raíz del proyecto**:

```bash
# Iniciar servicios
npm run docker:up

# Verificar configuración
npm run docker:check

# Detener servicios
npm run docker:down

# Reiniciar servicios
npm run docker:restart

# Ver logs
npm run docker:logs
npm run docker:logs:postgres
npm run docker:logs:valkey

# Limpiar todo (⚠️ elimina datos)
npm run docker:clean
```

---

## ⚙️ Servicios Configurados

### PostgreSQL

```yaml
Imagen: postgres:16-alpine
Puerto: 5433 → 5432 (contenedor)
Usuario: postgres
Password: postgres
Base de datos: dilus_db
Volumen: dilus-postgres-data
```

**Conectar:**

```bash
# Desde terminal
docker exec -it dilus-postgres psql -U postgres -d dilus_db

# Desde pgAdmin
Host: localhost
Port: 5433
Database: dilus_db
User: postgres
Password: postgres
```

### Valkey

```yaml
Imagen: valkey/valkey:8.1.3
Puerto: 6379
Password: valkey_password
Volumen: dilus-valkey-data
```

**Conectar:**

```bash
docker exec -it dilus-valkey valkey-cli -a valkey_password
```

---

## 🔧 Configuración

### Variables de Entorno

Asegúrate de que tu `backend/.env` apunte a los servicios Docker:

```env
# PostgreSQL (Docker)
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5433/dilus_db

# Valkey (Docker)
VALKEY_HOST=localhost
VALKEY_PORT=6379
VALKEY_PASSWORD=valkey_password
```

### Volúmenes

Los datos persisten en volúmenes de Docker:

- `dilus-postgres-data` - Datos de PostgreSQL
- `dilus-valkey-data` - Datos de Valkey

**Listar volúmenes:**

```bash
docker volume ls | grep dilus
```

**Eliminar volúmenes (⚠️ borra datos):**

```bash
npm run docker:clean
```

---

## 🐛 Troubleshooting

### Puerto 5433 en uso

Si el puerto 5433 está ocupado, cambia el puerto en `docker-compose.yml`:

```yaml
postgres:
  ports:
    - "5434:5432"  # Usar puerto 5434
```

Y actualiza `backend/.env`:

```env
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5434/dilus_db
```

### Contenedores no inician

```bash
# Ver logs detallados
npm run docker:logs

# Reiniciar desde cero
npm run docker:clean
npm run docker:up
```

### Error de permisos en volúmenes (Linux)

```bash
# Dar permisos al usuario actual
sudo chown -R $USER:$USER ~/.docker/volumes/dilus-*
```

---

## 📚 Documentación Relacionada

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - 🔧 Soluciones a problemas comunes
- **[PGADMIN.md](./PGADMIN.md)** - 🗄️ Cómo conectar pgAdmin a PostgreSQL
- [Guía completa de Docker](../DOCKER.md)
- [Inicio Rápido](../QUICKSTART.md)
- [README principal](../README.md)

---

## 🔄 Actualizar Servicios

Para actualizar a versiones más recientes:

```yaml
# En docker-compose.yml
postgres:
  image: postgres:17-alpine  # Nueva versión

valkey:
  image: valkey/valkey:9.0.0  # Nueva versión
```

Luego:

```bash
npm run docker:down
npm run docker:up
```

---

## 💡 Tips

- Los contenedores pueden quedarse corriendo entre sesiones
- No necesitas hacer `docker:down` cada vez
- Usa `docker:check` para verificar el estado rápidamente
- Los volúmenes persisten incluso después de `docker:down`
