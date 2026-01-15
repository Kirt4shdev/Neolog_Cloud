# 🔍 REVISAR ERRORES DEL FRONTEND EN DOCKER

**Fecha**: 2026-01-15 09:20  
**Estado**: ⏳ Pendiente - Docker Desktop no está corriendo

---

## ⚠️ IMPORTANTE

**Docker Desktop NO está corriendo**. Necesitas iniciarlo antes de poder revisar los logs.

---

## 🚀 PASOS PARA REVISAR ERRORES

### 1. Inicia Docker Desktop

```
1. Busca "Docker Desktop" en el menú de inicio
2. Ábrelo y espera a que inicie
3. Verás el ícono de Docker en la barra de tareas (ballena)
```

### 2. Verifica que los contenedores estén corriendo

```powershell
cd C:\Github\dilus-app-template\docker
docker compose ps
```

**Deberías ver algo como**:
```
NAME                        STATUS
neologg_cloud_backend       Up X minutes (healthy)
neologg_cloud_frontend      Up X minutes
neologg_cloud_postgres      Up X minutes (healthy)
...
```

### 3. Ver logs del frontend

```powershell
docker logs neologg_cloud_frontend --tail 100
```

### 4. Ver logs en tiempo real

```powershell
docker compose logs -f frontend
```

**Para detener**: Ctrl+C

---

## 🔧 ERRORES COMUNES Y SOLUCIONES

### Error 1: Cannot find module '@core/...'

**Síntoma**:
```
Error: Cannot find module '@core/auth/contracts/LoginContract'
```

**Causa**: Los tipos del backend no están montados correctamente en el volumen.

**Solución**:
```powershell
# Verificar volúmenes montados
docker inspect neologg_cloud_frontend | Select-String -Pattern "Mounts" -Context 0,20

# Si los volúmenes no están, recrear el contenedor
docker compose down frontend
docker compose up -d frontend
```

---

### Error 2: ENOENT: no such file or directory

**Síntoma**:
```
ENOENT: no such file or directory, open '/app/frontend/src/...'
```

**Causa**: El código fuente no está montado correctamente.

**Solución**:
```powershell
# Verificar que los archivos existan en el host
ls frontend/src/

# Recrear contenedor con volúmenes
docker compose down frontend
docker compose up -d frontend
```

---

### Error 3: Port 5173 already in use

**Síntoma**:
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5173
```

**Causa**: Otro proceso está usando el puerto 5173.

**Solución**:
```powershell
# Encontrar el proceso
netstat -ano | findstr ":5173"

# Matar el proceso (reemplaza PID con el número que encontraste)
taskkill /F /PID [PID]

# Reiniciar contenedor
docker compose restart frontend
```

---

### Error 4: Module parse failed

**Síntoma**:
```
Module parse failed: Unexpected token
```

**Causa**: Vite no puede compilar un archivo.

**Solución**:
```powershell
# Limpiar caché de node_modules en el contenedor
docker compose exec frontend rm -rf node_modules/.vite

# O recrear el contenedor
docker compose down frontend
docker compose build frontend --no-cache
docker compose up -d frontend
```

---

### Error 5: Failed to resolve import

**Síntoma**:
```
Failed to resolve import "@/components/..." from "src/..."
```

**Causa**: Los path aliases de Vite no se resolvieron correctamente.

**Solución**:

Verificar `frontend/vite.config.ts`:
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@core": path.resolve(__dirname, "../backend/src/core"),
    "@shared": path.resolve(__dirname, "../backend/src/shared"),
  },
},
```

Si falta algo:
```powershell
# Reconstruir
docker compose build frontend
docker compose up -d frontend
```

---

### Error 6: CORS error

**Síntoma**:
```
Access to fetch at 'http://localhost:8094/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Causa**: El backend no acepta peticiones del frontend.

**Solución**:

Verificar que `backend.env` tenga:
```
API_ALLOWED_CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

Si falta:
```powershell
# Editar docker/backend.env y agregar la línea
# Luego reiniciar backend
docker compose restart backend
```

---

## 📊 COMANDOS ÚTILES PARA DEBUGGING

### Ver todos los logs del frontend

```powershell
docker logs neologg_cloud_frontend
```

### Ver logs con timestamps

```powershell
docker logs neologg_cloud_frontend --timestamps
```

### Ver logs desde un momento específico

```powershell
docker logs neologg_cloud_frontend --since 10m  # Últimos 10 minutos
```

### Ver logs de todos los servicios

```powershell
docker compose logs --tail 100
```

### Entrar al contenedor

```powershell
docker exec -it neologg_cloud_frontend sh
```

Una vez dentro:
```sh
# Ver archivos
ls -la /app/frontend/src/

# Ver proceso de Vite
ps aux | grep vite

# Salir
exit
```

### Ver uso de recursos

```powershell
docker stats neologg_cloud_frontend
```

### Reiniciar solo el frontend

```powershell
docker compose restart frontend
```

### Reconstruir frontend

```powershell
docker compose build frontend --no-cache
docker compose up -d frontend
```

---

## 🔄 SI TODO FALLA

### Opción 1: Rebuild Completo

```powershell
cd C:\Github\dilus-app-template\docker

# Detener frontend
docker compose down frontend

# Eliminar imagen
docker rmi neologg_cloud-frontend

# Reconstruir desde cero
docker compose build frontend --no-cache

# Levantar
docker compose up -d frontend

# Ver logs
docker compose logs -f frontend
```

### Opción 2: Usar Frontend de Producción (Nginx)

Si el frontend en modo desarrollo sigue dando problemas, puedes cambiar a la versión de producción:

**Editar `docker-compose.yml`**:

1. **Comentar** el servicio `frontend` actual (modo desarrollo)
2. **Descomentar** el servicio `frontend-prod` (Nginx)
3. **Renombrar** `frontend-prod` a `frontend`

```powershell
# Luego
docker compose build frontend
docker compose up -d frontend
```

---

## 📝 REPORTE DE ERRORES

Una vez que Docker esté corriendo y puedas ver los logs, copia el error y compártelo para ayudarte mejor.

### Formato del reporte:

```
ERROR DEL FRONTEND:

1. Comando ejecutado:
   docker logs neologg_cloud_frontend --tail 50

2. Output del error:
   [Pegar aquí los últimos 20-30 líneas del log]

3. ¿Qué estabas haciendo cuando ocurrió?
   [Describir la acción]

4. ¿Es la primera vez que levantas el frontend?
   [Sí/No]
```

---

## ✅ CHECKLIST PRE-DEBUGGING

Antes de buscar errores, verifica:

- [ ] Docker Desktop está corriendo
- [ ] Los contenedores están up: `docker compose ps`
- [ ] El backend está healthy: `docker ps --filter "name=backend"`
- [ ] PostgreSQL está healthy: `docker ps --filter "name=postgres"`
- [ ] No hay conflictos de puertos: `netstat -ano | findstr ":5173"`
- [ ] Los archivos del frontend existen: `ls frontend/src/`

---

## 🎯 PRÓXIMO PASO

1. **Inicia Docker Desktop**
2. **Ejecuta**:
   ```powershell
   cd C:\Github\dilus-app-template\docker
   docker compose up -d
   ```
3. **Ver logs**:
   ```powershell
   docker compose logs -f frontend
   ```
4. **Comparte los errores** que veas para poder ayudarte

---

**Estado**: 🟡 Esperando Docker Desktop  
**Acción pendiente**: Iniciar Docker y revisar logs  
**Fecha**: 2026-01-15 09:20
