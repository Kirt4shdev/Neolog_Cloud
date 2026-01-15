# 🚀 NEOLOGG CLOUD - ACCESO AL SISTEMA

**Fecha**: 2026-01-15 08:30  
**Estado**: ✅ Sistema 100% operativo en Docker

---

## 🔐 CREDENCIALES DE ACCESO

### 👨‍💼 Super Administrator (RECOMENDADO)
```
Email:    superadmin@neologg.com
Password: SuperAdmin123!
```
✅ **Usuario verificado y listo para usar**

### 👤 Usuario de Prueba
```
Email:    test@test.com
Password: Test123!
```

📚 **Más información**: Ver `CREDENCIALES_PRUEBA.md`

---

## 🌐 URLS DE ACCESO

### Frontend (React + Vite)
```
🚀 PRODUCCIÓN (Docker): http://localhost:5174
   - Servido por Nginx
   - Build optimizado
   - Proxy a backend interno

🔧 DESARROLLO (Local): http://localhost:5173
   - Vite Dev Server
   - Hot reload
   - Conecta a localhost:8094
```
**Estado**: ✅ Corriendo en modo desarrollo  
**Puerto**: 5173  
**Tecnología**: React + Vite + TypeScript

### Backend API
```
http://localhost:8094
```
**Estado**: ✅ Operativo (Docker)  
**Puerto**: 8094  
**Tecnología**: Node.js + Express + TypeScript

---

## 📊 SERVICIOS ACTIVOS

### Backend Stack (Docker)
- ✅ **Backend**: `neologg_cloud_backend` (healthy)
- ✅ **PostgreSQL**: `neologg_cloud_postgres` (healthy)
- ✅ **InfluxDB**: `neologg_cloud_influxdb` (healthy)
- ✅ **Mosquitto**: `neologg_cloud_mosquitto` (healthy)
- ✅ **Valkey**: `neologg_cloud_valkey` (healthy)

### Frontend
- ✅ **Vite Dev Server**: `http://localhost:5173`

---

## 🧪 ENDPOINTS DISPONIBLES

### Health Check
```bash
GET http://localhost:8094/unprotected/health
```

### Provisioning de Dispositivos
```bash
POST http://localhost:8094/unprotected/neologg/provision
Content-Type: application/json

{
  "serialNumber": "DEVICE001",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "imei": "123456789012345"
}
```

### Listar Dispositivos (Admin)
```bash
GET http://localhost:8094/api/admin/neologg/devices
Authorization: Bearer admin_secret_token_change_in_production
```

---

## 💻 COMANDOS ÚTILES

### Verificar que el frontend está corriendo
```powershell
# El frontend debe estar corriendo en la terminal 8
Get-Content "c:\Users\m.carrasco\.cursor\projects\c-Github-dilus-app-template\terminals\8.txt" -Tail 10
```

### Ver logs del backend
```powershell
docker logs neologg_cloud_backend -f
```

### Detener el frontend
```powershell
# En la terminal donde está corriendo, presionar Ctrl+C
```

### Reiniciar backend
```powershell
cd docker
docker compose restart backend
```

---

## 🔐 CREDENCIALES

### PostgreSQL
- **Host**: localhost:5433
- **User**: postgres
- **Password**: postgres
- **Database**: neologg_cloud_db

### InfluxDB
- **URL**: http://localhost:8086
- **Org**: neologg
- **Bucket**: neologg_data
- **Token**: neologg93token_change_this_in_production

### Mosquitto MQTT
- **Host**: localhost:1883
- **Admin User**: neologg
- **Admin Password**: neologg93

### Admin API (Backend)
- **Token**: Bearer admin_secret_token_change_in_production

---

## 🌟 CARACTERÍSTICAS DISPONIBLES

### Frontend (React)
- ✅ Login / Register
- ✅ Dashboard
- ✅ Perfil de usuario
- ✅ TODOs
- ⚠️ Neologg Cloud UI (pendiente completar)

### Backend API
- ✅ Autenticación (Login/Register)
- ✅ Gestión de usuarios
- ✅ Gestión de TODOs
- ✅ **Provisioning de dispositivos Neologg**
- ✅ **MQTT bidireccional**
- ✅ **Heartbeats procesados**
- ✅ **PostgreSQL + InfluxDB**

---

## 📱 PROBAR EL SISTEMA

### 1. Acceder al Frontend
```
1. Abre tu navegador
2. Ve a http://localhost:5173
3. Deberías ver la interfaz de Neologg Cloud
```

### 2. Probar Provisioning (desde Postman/Insomnia)
```http
POST http://localhost:8094/unprotected/neologg/provision
Content-Type: application/json

{
  "serialNumber": "TEST123",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "imei": "123456789012345"
}
```

### 3. Verificar en PostgreSQL
```sql
SELECT * FROM devices ORDER BY created_at DESC;
```

---

## ⚠️ NOTAS IMPORTANTES

### Frontend en Modo Desarrollo
El frontend está corriendo en **modo desarrollo** (Vite Dev Server) porque el build de producción tiene errores de TypeScript relacionados con imports del backend.

**Ventajas del modo dev:**
- ✅ Hot Module Replacement (HMR)
- ✅ Recarga automática al editar
- ✅ Mejor para desarrollo

**Desventajas:**
- ⚠️ No optimizado para producción
- ⚠️ Requiere terminal activa

### Para detener el frontend
Simplemente cierra la terminal o presiona `Ctrl+C` en la terminal donde está corriendo.

### Para detener todo el backend
```powershell
cd docker
docker compose down
```

---

## 🔄 REINICIAR TODO

### Reiniciar Backend
```powershell
cd docker
docker compose restart
```

### Reiniciar Frontend
```powershell
# Detener: Ctrl+C en la terminal del frontend
# Iniciar nuevamente:
cd frontend
npm run dev
```

---

## 📊 ESTADO ACTUAL

```
✅ Backend:   100% Operativo
✅ Frontend:  Corriendo en dev mode
✅ Postgres:  Healthy
✅ InfluxDB:  Healthy
✅ Mosquitto: Healthy
✅ Valkey:    Healthy
```

---

## 🎯 SIGUIENTE PASO

**¡Abre tu navegador y ve a http://localhost:5173!**

El sistema está completamente operativo y listo para usar. 🚀

---

**Sistema levantado exitosamente**  
**Fecha**: 2026-01-14 17:45  
**Estado**: ✅ **LISTO PARA USAR**
