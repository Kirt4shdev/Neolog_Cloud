# 🔧 Troubleshooting - Docker

Soluciones a problemas comunes con Docker en este proyecto.

---

## ❌ Error: "la autentificación password falló para el usuario postgres"

### Síntoma

```
WARNING Connection attempt 1/3 failed: la autentificación password falló para el usuario "postgres"
```

### Causa

El archivo `backend/.env` está configurado con el **puerto incorrecto**. Está intentando conectarse al PostgreSQL local (puerto 5432) en vez del contenedor Docker (puerto 5433).

### Solución

**Opción 1: Automática**

```bash
npm run docker:check
```

El script detectará el problema y te dirá qué hacer.

**Opción 2: Manual**

Edita `backend/.env` y cambia el puerto:

```env
# ❌ Incorrecto
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5432/dilus_db

# ✅ Correcto
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5433/dilus_db
```

Reinicia el backend:

```bash
npm run dev:backend
```

---

## ❌ Error: "Valkey connection timeout"

### Síntoma

```
Error: Valkey connection timeout. Is the Docker container running?
```

### Causa

El contenedor de Valkey no está corriendo o no está accesible.

### Solución

```bash
# Verificar contenedores
docker ps | grep valkey

# Si no está corriendo
npm run docker:up

# Ver logs
npm run docker:logs:valkey
```

---

## ❌ Error: "Container name already in use"

### Síntoma

```
Error: Conflict. The container name "/dilus-postgres" is already in use
```

### Causa

Ya existen contenedores con esos nombres de una ejecución anterior.

### Solución

```bash
# Eliminar contenedores antiguos
docker rm -f dilus-postgres dilus-valkey

# Levantar de nuevo
npm run docker:up
```

---

## ❌ Puerto 5433 ya en uso

### Síntoma

```
Error: Bind for 0.0.0.0:5433 failed: port is already allocated
```

### Causa

Otro servicio está usando el puerto 5433.

### Solución

**Opción 1: Cambiar el puerto de Docker**

Edita `docker/docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - "5434:5432" # Cambiar a 5434 o cualquier otro puerto libre
```

Y actualiza `backend/.env`:

```env
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5434/dilus_db
```

**Opción 2: Encontrar qué está usando el puerto**

```powershell
# Windows
netstat -ano | findstr :5433

# Linux/Mac
lsof -i :5433
```

---

## ❌ Los contenedores no se detienen

### Síntoma

```bash
npm run docker:down
# Los contenedores siguen corriendo
```

### Solución

```bash
# Forzar detención
docker stop dilus-postgres dilus-valkey

# Si persiste, eliminar forzadamente
docker rm -f dilus-postgres dilus-valkey
```

---

## ❌ Error: "database.sql not found"

### Síntoma

```
Error: database.sql no fue generado
```

### Causa

El script `create-database.js` falló o no se ejecutó correctamente.

### Solución

```bash
# Generar manualmente
npm run database:create

# Verificar que existe
ls backend/src/infrastructure/database/sql/database.sql
```

---

## ❌ Volúmenes con datos antiguos

### Síntoma

Los cambios en la base de datos no se reflejan, o tienes datos de pruebas anteriores.

### Solución

**⚠️ ADVERTENCIA: Esto eliminará TODOS los datos**

```bash
# Detener contenedores y eliminar volúmenes
npm run docker:clean

# Levantar de nuevo
npm run docker:up

# Reinicializar base de datos
npm run database:init
```

---

## ❌ Docker no está instalado

### Síntoma

```
'docker' no se reconoce como un comando interno o externo
```

### Solución

**Windows:**

1. Descarga [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Instala y reinicia
3. Verifica: `docker --version`

**Linux:**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Verificar
docker --version
```

**Mac:**

1. Descarga [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop)
2. Instala
3. Verifica: `docker --version`

---

## ❌ Docker no está corriendo

### Síntoma

```
Error: Cannot connect to the Docker daemon
```

### Solución

**Windows/Mac:**

1. Abre Docker Desktop
2. Espera a que el icono de la ballena esté verde
3. Intenta de nuevo

**Linux:**

```bash
# Iniciar servicio Docker
sudo systemctl start docker

# Verificar estado
sudo systemctl status docker
```

---

## ❌ Permisos denegados (Linux)

### Síntoma

```
Got permission denied while trying to connect to the Docker daemon
```

### Solución

```bash
# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker

# Verificar
docker ps
```

---

## ❌ Conexión lenta a PostgreSQL

### Síntoma

El backend tarda mucho en conectarse a PostgreSQL.

### Solución

```bash
# Ver recursos del contenedor
docker stats dilus-postgres

# Si está usando demasiada CPU/RAM, reiniciar
npm run docker:restart
```

---

## ❌ Error al ejecutar `database:init`

### Síntoma

```
Error al ejecutar SQL en el contenedor
```

### Solución

```bash
# Verificar que el contenedor está corriendo
docker ps | grep postgres

# Verificar que se puede conectar
docker exec -it dilus-postgres psql -U postgres -d dilus_db

# Si funciona, reintentar
npm run database:init
```

---

## ❌ Logs no se muestran

### Síntoma

`npm run docker:logs` no muestra nada.

### Solución

```bash
# Ver logs directamente con Docker
docker logs dilus-postgres
docker logs dilus-valkey

# Seguir logs en tiempo real
docker logs -f dilus-postgres
```

---

## 🔍 Comandos de Diagnóstico

### Verificar todo de una vez

```bash
npm run docker:check
```

### Información de contenedores

```bash
# Ver todos los contenedores
docker ps -a

# Inspeccionar contenedor
docker inspect dilus-postgres

# Ver recursos
docker stats
```

### Información de volúmenes

```bash
# Listar volúmenes
docker volume ls | grep dilus

# Inspeccionar volumen
docker volume inspect dilus-postgres-data
```

### Información de red

```bash
# Listar redes
docker network ls | grep dilus

# Inspeccionar red
docker network inspect dilus-network
```

---

## 📞 ¿Aún tienes problemas?

Si ninguna solución funcionó:

1. **Recopila información:**

   ```bash
   # Guardar logs
   docker logs dilus-postgres > postgres-logs.txt
   docker logs dilus-valkey > valkey-logs.txt
   docker ps -a > containers.txt
   ```

2. **Reinicio completo:**

   ```bash
   npm run docker:clean
   rm -rf node_modules backend/node_modules
   npm install
   npm run docker:up
   npm run database:init
   ```

3. **Consulta la documentación:**

   - [docker/README.md](./README.md)
   - [DOCKER.md](../DOCKER.md)
   - [QUICKSTART.md](../QUICKSTART.md)

4. **Abre un issue en GitHub** con los logs adjuntos

---

## 💡 Tips para Evitar Problemas

1. **Siempre verifica antes de empezar:**

   ```bash
   npm run docker:check
   ```

2. **Usa el puerto correcto (5433):**

   ```env
   POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5433/dilus_db
   ```

3. **Mantén Docker Desktop actualizado**

4. **Revisa los logs regularmente:**

   ```bash
   npm run docker:logs
   ```

5. **Haz backups de la base de datos:**
   ```bash
   docker exec dilus-postgres pg_dump -U postgres dilus_db > backup-$(date +%Y%m%d).sql
   ```

---

**Última actualización:** 2026-01-12
