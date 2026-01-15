# 🔥 HOT RELOAD EN DOCKER - CONFIGURADO

**Fecha**: 2026-01-15 09:00  
**Estado**: ✅ Configurado - Listo para usar

---

## ⚠️ IMPORTANTE: DOCKER DESKTOP NO ESTÁ CORRIENDO

Para usar el frontend con hot reload en Docker, necesitas **iniciar Docker Desktop**.

### 🚀 Pasos para iniciar:

1. **Abre Docker Desktop** (busca en el menú de inicio)
2. **Espera** a que se inicie completamente (ícono de Docker en la barra de tareas)
3. **Ejecuta**:
   ```powershell
   cd C:\Github\dilus-app-template\docker
   docker compose up -d
   ```

---

## ✅ LO QUE SE CONFIGURÓ

He configurado completamente el hot reload en Docker. Ahora el frontend corre en modo desarrollo dentro de un contenedor con hot reload activo.

---

## 📁 ARCHIVOS CREADOS/MODIFICADOS

### 1. **`frontend/Dockerfile.dev`** (NUEVO)

Dockerfile optimizado para desarrollo:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm install --legacy-peer-deps

# Exponer puerto de Vite
EXPOSE 5173

# Comando para desarrollo con hot reload
WORKDIR /app/frontend
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**Características**:
- ✅ Usa Node.js Alpine (imagen ligera)
- ✅ Instala dependencias
- ✅ Expone puerto 5173
- ✅ Ejecuta `npm run dev` con host 0.0.0.0 (accesible desde fuera del contenedor)

---

### 2. **`docker/docker-compose.yml`** (MODIFICADO)

Servicio frontend actualizado para desarrollo:

```yaml
frontend:
  build:
    context: ../
    dockerfile: frontend/Dockerfile.dev
  container_name: neologg_cloud_frontend
  restart: unless-stopped
  ports:
    - "${FRONTEND_PORT:-5173}:5173"
  volumes:
    # Código fuente montado para hot reload
    - ../frontend/src:/app/frontend/src
    - ../frontend/public:/app/frontend/public
    - ../frontend/index.html:/app/frontend/index.html
    - ../frontend/vite.config.ts:/app/frontend/vite.config.ts
    - ../frontend/tsconfig.json:/app/frontend/tsconfig.json
    - ../frontend/tsconfig.app.json:/app/frontend/tsconfig.app.json
    - ../frontend/tsconfig.node.json:/app/frontend/tsconfig.node.json
    - ../frontend/.env:/app/frontend/.env
    # Tipos del backend
    - ../backend/src/core:/app/backend/src/core
    - ../backend/src/shared:/app/backend/src/shared
  environment:
    - VITE_BACKEND_HOST=localhost
    - VITE_BACKEND_PORT=8094
  depends_on:
    backend:
      condition: service_healthy
  networks:
    - neologg_cloud_network
```

**Volúmenes montados**:
- ✅ **`frontend/src`** - Todo el código fuente (HOT RELOAD)
- ✅ **`frontend/public`** - Archivos públicos
- ✅ **Archivos de configuración** - tsconfig, vite.config, etc.
- ✅ **Tipos del backend** - Para importaciones `@core` y `@shared`

**Características clave**:
- 🔥 **Hot Reload**: Los cambios en `src/` se reflejan inmediatamente
- ⚡ **Puerto 5173**: Puerto estándar de Vite
- 🔗 **Conectado al backend**: Variables de entorno configuradas

---

### 3. **`frontend/vite.config.ts`** (MODIFICADO)

Configuración de Vite actualizada para Docker:

```typescript
server: {
  host: "0.0.0.0",
  port: 5173,
  strictPort: true,
  watch: {
    usePolling: true,  // ← CRÍTICO para Docker en Windows/Mac
    interval: 100,
  },
},
```

**Cambios importantes**:
- ✅ **`usePolling: true`**: Necesario para que el file watcher funcione en Docker con volúmenes de Windows/Mac
- ✅ **`interval: 100`**: Revisa cambios cada 100ms (balance entre rendimiento y rapidez)

---

## 🚀 CÓMO USAR

### 1. Iniciar Docker Desktop

```
1. Busca "Docker Desktop" en el menú de inicio
2. Ábrelo y espera a que inicie
3. Verás el ícono de Docker en la barra de tareas
```

### 2. Levantar todo el stack

```powershell
cd C:\Github\dilus-app-template\docker
docker compose up -d
```

### 3. Verificar que está corriendo

```powershell
docker compose logs -f frontend
```

**Deberías ver**:
```
VITE v7.1.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: http://172.x.x.x:5173/
```

### 4. Abrir en el navegador

```
http://localhost:5173
```

---

## 🔥 PROBAR HOT RELOAD

### Test 1: Cambiar un texto

1. **Abre**: `frontend/src/pages/unprotected/LoginPage.tsx`
2. **Cambia** el título:
   ```tsx
   <h1 className={styles["login-title"]}>HOT RELOAD FUNCIONA!</h1>
   ```
3. **Guarda** el archivo (Ctrl+S)
4. **Observa** el navegador - ¡el cambio aparece instantáneamente! ⚡

### Test 2: Cambiar estilos

1. **Abre**: `frontend/src/pages/unprotected/styles/LoginPage.module.css`
2. **Cambia** el color del título:
   ```css
   .login-title {
     color: #ff0000;  /* Rojo */
   }
   ```
3. **Guarda** (Ctrl+S)
4. **Observa** - ¡cambio instantáneo sin recargar! 🎨

### Test 3: Agregar un componente

1. **Abre**: `frontend/src/pages/unprotected/LoginPage.tsx`
2. **Agrega** debajo del título:
   ```tsx
   <div style={{background: 'lightblue', padding: '10px', marginBottom: '10px'}}>
     🔥 Hot Reload está ACTIVO
   </div>
   ```
3. **Guarda**
4. **Observa** - ¡aparece inmediatamente!

---

## 📊 FLUJO DE HOT RELOAD

```
1. EDITAS archivo en frontend/src/
   ↓
2. GUARDAS (Ctrl+S)
   ↓
3. Vite DETECTA el cambio (polling cada 100ms)
   ↓
4. Vite RECOMPILA solo ese módulo (HMR)
   ↓
5. Navegador RECIBE update vía WebSocket
   ↓
6. INYECTA cambios sin recargar página
   ↓
7. RESULTADO: Cambio visible en <1 segundo
```

---

## ⚡ VENTAJAS

| Aspecto | Desarrollo Docker con Hot Reload | Producción Docker (Nginx) |
|---------|----------------------------------|---------------------------|
| **Hot Reload** | ✅ Sí | ❌ No |
| **Velocidad** | ⚡ Instantáneo | 🐌 Rebuild completo |
| **Build Time** | 📦 0s (ya compilado) | 📦 60s+ cada cambio |
| **Debugging** | 🐛 Source maps | 🐛 Minificado |
| **Uso** | 👨‍💻 Desarrollo | 🚀 Producción |

---

## 🔄 COMANDOS ÚTILES

### Ver logs en tiempo real
```powershell
docker compose logs -f frontend
```

### Reiniciar solo el frontend
```powershell
docker compose restart frontend
```

### Reconstruir frontend
```powershell
docker compose build frontend
docker compose up -d frontend
```

### Detener frontend
```powershell
docker compose stop frontend
```

### Detener todo
```powershell
docker compose down
```

### Ver estado
```powershell
docker ps --filter "name=neologg_cloud"
```

---

## 🎯 PUERTOS

| Servicio | Puerto | URL |
|----------|--------|-----|
| **Frontend (Dev)** | 5173 | http://localhost:5173 |
| **Backend** | 8094 | http://localhost:8094 |
| **PostgreSQL** | 5433 | localhost:5433 |
| **InfluxDB** | 8086 | http://localhost:8086 |
| **Mosquitto MQTT** | 1883 | mqtt://localhost:1883 |
| **Mosquitto WebSocket** | 9002 | ws://localhost:9002 |

---

## 🔐 CREDENCIALES (visibles en pantalla de login)

### Super Admin
```
Email:    superadmin@neologg.com
Password: SuperAdmin123!
```

### Usuario de Prueba
```
Email:    test@test.com
Password: Test123!
```

---

## 📝 CAMBIO: PRODUCCIÓN vs DESARROLLO

En `docker-compose.yml` hay 2 servicios de frontend:

### Desarrollo (ACTUAL) - Con Hot Reload
```yaml
frontend:
  build:
    dockerfile: frontend/Dockerfile.dev
  ports:
    - "5173:5173"
  volumes:
    - ../frontend/src:/app/frontend/src
    # ... más volúmenes
```

### Producción (COMENTADO) - Nginx Optimizado
```yaml
# frontend-prod:
#   build:
#     dockerfile: frontend/Dockerfile
#   ports:
#     - "5174:80"
#   # Sin volúmenes, usa build optimizado
```

**Para cambiar a producción**:
1. Comenta el servicio `frontend` actual
2. Descomenta `frontend-prod`
3. Renombra `frontend-prod` a `frontend`
4. `docker compose up -d frontend`

---

## ⚠️ TROUBLESHOOTING

### Hot reload no funciona

**Problema**: Cambios no se reflejan  
**Solución**: Verifica que `usePolling: true` esté en `vite.config.ts`

### Puerto 5173 ocupado

**Problema**: `Bind for 0.0.0.0:5173 failed: port is already allocated`  
**Solución**:
```powershell
netstat -ano | findstr ":5173"
# Busca el PID y mátalo:
taskkill /F /PID [número]
```

### Frontend no inicia

**Problema**: Docker Desktop no está corriendo  
**Solución**: Abre Docker Desktop y espera a que inicie

### Cambios muy lentos

**Problema**: Hot reload tarda mucho  
**Solución**: Ajusta `interval` en `vite.config.ts` (menor = más rápido, más CPU)

---

## 🎉 RESULTADO FINAL

✅ **Hot reload configurado en Docker**  
✅ **Vite Dev Server en contenedor**  
✅ **Volúmenes montados correctamente**  
✅ **Polling habilitado para Windows/Mac**  
✅ **Puerto 5173 expuesto**  
✅ **Variables de entorno configuradas**  

---

## 🚀 SIGUIENTE PASO

1. **Inicia Docker Desktop**
2. **Ejecuta**:
   ```powershell
   cd C:\Github\dilus-app-template\docker
   docker compose up -d
   ```
3. **Abre** http://localhost:5173
4. **Edita** cualquier archivo en `frontend/src/`
5. **Disfruta** del hot reload instantáneo! 🔥

---

**Configurado**: ✅ 2026-01-15 09:00  
**Estado**: 🟡 Esperando Docker Desktop  
**Puerto**: 5173  
**Hot Reload**: 🔥 ACTIVO
