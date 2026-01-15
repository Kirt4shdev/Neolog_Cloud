# 📂 Estructura de la Carpeta Docker

```
docker/
├── docker-compose.yml       # ⚙️ Configuración de servicios
├── test-docker-setup.js     # ✅ Script de verificación
├── .dockerignore            # 🚫 Archivos a ignorar
├── README.md                # 📖 Documentación principal
├── PGADMIN.md               # 🗄️ Guía de conexión con pgAdmin
└── STRUCTURE.md             # 📋 Este archivo
```

---

## 🎯 Propósito de Cada Archivo

### `docker-compose.yml`

**Propósito:** Define la infraestructura de Docker.

**Contiene:**
- Configuración de PostgreSQL (imagen, puertos, volúmenes)
- Configuración de Valkey (imagen, puertos, volúmenes)
- Configuración de red compartida
- Health checks

**Modificar para:**
- Cambiar puertos
- Cambiar versiones de imágenes
- Agregar nuevos servicios (ej: Redis, MongoDB)
- Configurar recursos (CPU, memoria)

---

### `test-docker-setup.js`

**Propósito:** Verificar que toda la infraestructura Docker está correctamente configurada.

**Verifica:**
1. Docker instalado
2. Docker corriendo
3. Contenedores activos
4. Conexiones exitosas
5. Base de datos creada
6. Archivo `.env` configurado

**Ejecutar:** `npm run docker:check`

**Salida:**
- ✅ Verde = Todo OK
- ❌ Rojo = Hay problemas
- ⚠️ Amarillo = Advertencias

---

### `.dockerignore`

**Propósito:** Lista de archivos que Docker debe ignorar al construir imágenes.

**Ignora:**
- `node_modules/`
- `.env` (secretos)
- `dist/` (builds)
- `.git/`
- Archivos de IDE
- Logs

**Modificar cuando:**
- Agregues nuevos servicios con Dockerfile
- Necesites incluir/excluir archivos específicos

---

### `.env.docker`

**Propósito:** Variables de entorno centralizadas para Docker.

**Contiene:**
- Credenciales de PostgreSQL
- Credenciales de Valkey
- Configuración de puertos

**⚠️ Nota:** Este archivo podría usarse en el futuro con `env_file` en `docker-compose.yml`.

---

### `README.md`

**Propósito:** Documentación principal de Docker.

**Contiene:**
- Descripción de archivos
- Comandos disponibles
- Configuración de servicios
- Troubleshooting

---

### `PGADMIN.md`

**Propósito:** Guía para conectar herramientas de administración de bases de datos.

**Contiene:**
- Configuración de pgAdmin
- Alternativas (DBeaver, DataGrip, VS Code)
- Consultas SQL útiles
- Troubleshooting de conexión

---

## 🔄 Flujo de Trabajo con Docker

### Setup Inicial

```bash
# 1. Levantar servicios
npm run docker:up

# 2. Verificar configuración
npm run docker:check

# 3. Inicializar base de datos
npm run database:init
```

### Desarrollo Día a Día

```bash
# Verificar estado (opcional)
npm run docker:check

# Desarrollar
npm run dev
```

### Modificar Configuración

1. Edita `docker/docker-compose.yml`
2. Reinicia: `npm run docker:restart`
3. O recrea: `npm run docker:down && npm run docker:up`

---

## 📦 Agregar Nuevos Servicios

Para agregar un nuevo servicio (ej: MongoDB):

### 1. Editar `docker-compose.yml`

```yaml
services:
  # ... servicios existentes ...

  mongodb:
    image: mongo:7
    container_name: dilus-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - dilus-network

volumes:
  # ... volúmenes existentes ...
  mongo_data:
    driver: local
    name: dilus-mongo-data
```

### 2. Agregar Script en `package.json`

```json
{
  "scripts": {
    "docker:logs:mongo": "docker compose -f docker/docker-compose.yml logs -f mongodb"
  }
}
```

### 3. Actualizar `backend/.env`

```env
MONGO_CONNECTION_STRING=mongodb://admin:admin123@localhost:27017/dilus_db
```

### 4. Actualizar `test-docker-setup.js`

Agrega verificación para MongoDB en el array `checks`.

---

## 🔒 Seguridad

### Producción

Para producción, considera:

1. **Usar Docker Secrets**

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    external: true
```

2. **Limitar recursos**

```yaml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

3. **Red aislada**

```yaml
networks:
  backend:
    driver: bridge
    internal: true
```

---

## 📊 Volúmenes

### Listar volúmenes

```bash
docker volume ls | grep dilus
```

**Salida:**

```
local     dilus-postgres-data
local     dilus-valkey-data
```

### Inspeccionar volumen

```bash
docker volume inspect dilus-postgres-data
```

### Backup de volumen

```bash
# PostgreSQL
docker exec dilus-postgres pg_dump -U postgres dilus_db > backup-$(date +%Y%m%d).sql

# Valkey (exportar todas las keys)
docker exec dilus-valkey valkey-cli -a valkey_password --rdb /data/dump.rdb SAVE
```

---

## 🚀 Comandos Rápidos

```bash
# Setup completo
npm run docker:up && npm run database:init && npm run dev

# Verificar todo
npm run docker:check

# Reiniciar servicios
npm run docker:restart

# Limpiar y empezar de nuevo
npm run docker:clean && npm run docker:up && npm run database:init
```

---

## 📚 Más Información

- **[PGADMIN.md](./PGADMIN.md)** - Conectar con pgAdmin
- **[../DOCKER.md](../DOCKER.md)** - Guía completa de Docker
- **[../QUICKSTART.md](../QUICKSTART.md)** - Inicio rápido
- **[../backend/scripts/README.md](../backend/scripts/README.md)** - Scripts del backend
