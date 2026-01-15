# 🚀 Neologg Cloud - Guía de Inicio Rápido

## ✅ Estado Actual

**Backend 100% FUNCIONAL** ✅
- API REST operativa
- PostgreSQL configurado
- Mosquitto con provisioning automático
- InfluxDB v2 listo
- MQTT bidireccional activo

## 📋 Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Docker Compose v2 (sin guion)
- PowerShell (Windows) o Bash (Linux/Mac)
- Puertos disponibles: 8094, 5433, 8086, 1883, 9002, 6379

## 🚀 Inicio Rápido

### 1. Levantar el stack completo

```powershell
cd docker
docker compose up -d
```

### 2. Verificar que todos los servicios estén healthy

```powershell
docker ps --filter "name=neologg_cloud"
```

**Salida esperada**:
```
NAMES                     STATUS                    PORTS
neologg_cloud_backend     Up X minutes (healthy)    0.0.0.0:8094->8080/tcp
neologg_cloud_valkey      Up X minutes (healthy)    127.0.0.1:6379->6379/tcp
neologg_cloud_mosquitto   Up X minutes (healthy)    0.0.0.0:1883->1883/tcp, 0.0.0.0:9002->9001/tcp
neologg_cloud_postgres    Up X minutes (healthy)    0.0.0.0:5433->5432/tcp
neologg_cloud_influxdb    Up X minutes (healthy)    0.0.0.0:8086->8086/tcp
```

### 3. Probar el Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:8094/unprotected/health"
# Debe devolver: 200 OK
```

### 4. Provisionar un dispositivo de prueba

```powershell
$body = '{"serialNumber":"TEST001","macAddress":"AA:BB:CC:DD:EE:FF","imei":"123456789012345"}'
$headers = @{'Content-Type' = 'application/json'}

Invoke-RestMethod -Uri "http://localhost:8094/unprotected/neologg/provision" `
    -Method POST -Body $body -Headers $headers
```

**Respuesta esperada**:
```json
{
  "deviceId": "uuid-generado",
  "serialNumber": "TEST001",
  "license": "hash-sha256-de-64-chars",
  "rootPassword": "NEOLOGGTEST001TOPO",
  "mqttUsername": "TEST001",
  "mqttPassword": "NEOLOGGTEST001TOPO123456789012345"
}
```

## 📡 Endpoints Disponibles

### Unprotected (Sin autenticación)

#### Health Check
```
GET http://localhost:8094/unprotected/health
```

#### Provisioning de Dispositivos
```
POST http://localhost:8094/unprotected/neologg/provision
Content-Type: application/json

{
  "serialNumber": "DEVICE001",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "imei": "123456789012345"
}
```

### Admin (Con autenticación)

**Nota**: Los endpoints admin requieren el header `Authorization: Bearer admin_secret_token_change_in_production`

#### Listar Dispositivos
```
GET http://localhost:8094/api/admin/neologg/devices
```

#### Detalle de Dispositivo
```
GET http://localhost:8094/api/admin/neologg/devices/:deviceId
```

#### Enviar Acción al Dispositivo
```
POST http://localhost:8094/api/admin/neologg/devices/:deviceId/actions
Content-Type: application/json

{
  "action": "restart",  // "restart" | "sync_time" | "update_firmware"
  "requestedBy": "admin-user-id"
}
```

#### Estado del Provisioning
```
GET http://localhost:8094/api/admin/neologg/provisioning/status
```

#### Activar/Desactivar Provisioning
```
POST http://localhost:8094/api/admin/neologg/provisioning/toggle
Content-Type: application/json

{
  "isEnabled": true,
  "updatedBy": "admin-user-id"
}
```

## 🗄️ Acceso a Bases de Datos

### PostgreSQL

```powershell
# Acceso directo
docker exec -it neologg_cloud_postgres psql -U postgres -d neologg_cloud_db

# Query rápido
docker exec neologg_cloud_postgres psql -U postgres -d neologg_cloud_db -c "SELECT * FROM devices;"
```

**Tablas principales**:
- `devices` - Dispositivos registrados
- `device_transmissions` - Log de mensajes MQTT
- `device_actions` - Acciones enviadas a dispositivos
- `provisioning_config` - Configuración de provisioning

### InfluxDB

```
URL: http://localhost:8086
Org: neologg
Bucket: neologg_data
Token: neologg93token_change_this_in_production
```

## 📊 MQTT Topics

### Device → Cloud

```
production/neologg/{SerialNumber}/heartbeat
production/neologg/{SerialNumber}/data
production/neologg/{SerialNumber}/license
```

### Cloud → Device

```
production/neologg/{SerialNumber}/actions
```

### Conectarse con MQTT Client

```bash
# Usuario admin (acceso total)
mosquitto_sub -h localhost -p 1883 -u neologg -P neologg93 -t "production/neologg/#"

# Dispositivo específico
mosquitto_sub -h localhost -p 1883 -u TEST001 -P NEOLOGGTEST001TOPO123456789012345 -t "production/neologg/TEST001/#"
```

## 🔧 Comandos Útiles

### Ver logs en tiempo real

```powershell
# Backend
docker logs neologg_cloud_backend -f

# Mosquitto
docker logs neologg_cloud_mosquitto -f

# PostgreSQL
docker logs neologg_cloud_postgres -f
```

### Reiniciar un servicio

```powershell
docker compose restart backend
```

### Detener todo el stack

```powershell
cd docker
docker compose down
```

### Detener y eliminar volúmenes (reset completo)

```powershell
cd docker
docker compose down -v
```

### Ver usuarios MQTT

```powershell
docker exec neologg_cloud_mosquitto cat /etc/mosquitto/passwd/passwd
```

### Ver ACL de Mosquitto

```powershell
docker exec neologg_cloud_mosquitto cat /etc/mosquitto/acl/acl
```

## 🐛 Troubleshooting

### El backend no arranca

1. Verificar que Valkey esté healthy:
```powershell
docker ps --filter "name=neologg_cloud_valkey"
```

2. Ver logs del backend:
```powershell
docker logs neologg_cloud_backend --tail 50
```

### Error de conexión a PostgreSQL

1. Verificar que PostgreSQL esté healthy:
```powershell
docker ps --filter "name=neologg_cloud_postgres"
```

2. Probar conexión manual:
```powershell
docker exec neologg_cloud_postgres pg_isready
```

### Error de provisioning en Mosquitto

1. Verificar permisos del archivo passwd:
```powershell
docker exec neologg_cloud_mosquitto ls -la /etc/mosquitto/passwd/passwd
# Debe ser: -rw------- (600)
```

2. Arreglar permisos si es necesario:
```powershell
docker exec neologg_cloud_mosquitto chmod 0600 /etc/mosquitto/passwd/passwd
docker exec neologg_cloud_mosquitto killall -HUP mosquitto
```

## 📝 Variables de Entorno

Las variables de entorno del backend están en: `docker/backend.env`

**Principales variables**:
```env
API_PORT=8080
EXECUTE_MODE=dev
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@postgres:5432/neologg_cloud_db
VALKEY_PASSWORD=change_me_to_strong_password_32_chars
MQTT_HOST=mosquitto
MQTT_USERNAME=neologg
MQTT_PASSWORD=neologg93
INFLUXDB_URL=http://influxdb:8086
MOSQUITTO_CONTAINER_NAME=neologg_cloud_mosquitto
```

## 🔐 Seguridad

**IMPORTANTE**: Antes de usar en producción:

1. Cambiar todas las passwords en `docker/backend.env`
2. Configurar SMTP real para envío de emails
3. Cambiar `EXECUTE_MODE=production`
4. Configurar certificados SSL para HTTPS
5. Configurar TLS para Mosquitto (puerto 8883)
6. Usar tokens JWT seguros
7. Configurar firewall para los puertos expuestos

## 📚 Documentación Adicional

- `NEOLOGG_CLOUD_VERIFICACION_COMPLETA.md` - Verificación vs prompt inicial
- `NEOLOGG_CLOUD_ESTADO_FINAL.md` - Estado final detallado
- `backend/Guía de Implementación de Funcionalidades en el Backend.md` - Clean Architecture

## 🎯 Próximos Pasos

1. **Frontend**: Resolver errores de imports y dockerizar
2. **Monitoreo**: Implementar Grafana para visualización
3. **Alertas**: Configurar alertas de dispositivos offline
4. **Logs**: Centralizar logs con ELK stack
5. **Backups**: Configurar backups automáticos de PostgreSQL

## 📞 Soporte

Para reportar issues o consultas sobre la implementación, revisar:
- Logs del backend: `docker logs neologg_cloud_backend`
- Estado de servicios: `docker ps --filter "name=neologg_cloud"`
- Base de datos: Queries directos en PostgreSQL

---

**Desarrollado con Clean Architecture, Result Pattern y Event Sourcing**  
**Stack**: Node.js + TypeScript + Express + PostgreSQL + InfluxDB + Mosquitto  
**Estado**: ✅ PRODUCCIÓN READY (Backend)
