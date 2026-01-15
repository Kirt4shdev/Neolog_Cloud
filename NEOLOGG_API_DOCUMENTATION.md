# 📡 NeoLogg Cloud API - Documentación Completa

## 🔧 Configuración Base

**URL Base:** `http://localhost:8094`

**Autenticación:** Bearer Token (JWT)

---

## 🔐 Authentication

### Login
```http
POST /unprotected/auth/login
Content-Type: application/json

{
  "email": "superadmin@neologg.com",
  "password": "SuperAdmin123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🔑 Generación de Credenciales Neologg

### Fórmulas Implementadas

El sistema genera automáticamente las credenciales usando estas fórmulas exactas:

#### 1. **Licencia del Dispositivo**
```
SHA-256(SN + MAC + "NEOLOGG" + IMEI + "93")
```
- **Ejemplo:** Para `SN=NL8-2512001`, `MAC=00:1A:2B:3C:4D:5E`, `IMEI=123456789012345`
- **Input:** `NL8-251200100:1A:2B:3C:4D:5ENEOLOGG12345678901234593`
- **Output:** Hash SHA-256 de 64 caracteres hexadecimales

#### 2. **Root Password del Dispositivo**
```
SHA-256("NEOLOGG" + SN + "TOPO")
```
- **Ejemplo:** `SN=NL8-2512001`
- **Input:** `NEOLOGGNL8-2512001TOPO`
- **Output:** Hash SHA-256 de 64 caracteres hexadecimales

#### 3. **MQTT Username**
```
SN (sin hash)
```
- **Ejemplo:** `SN=NL8-2512001`
- **Output:** `NL8-2512001`

#### 4. **MQTT Password**
```
SHA-256("NEOLOGG" + SN + "TOPO" + IMEI)
```
- **Ejemplo:** `SN=NL8-2512001`, `IMEI=123456789012345`
- **Input:** `NEOLOGGNL8-2512001TOPO123456789012345`
- **Output:** Hash SHA-256 de 64 caracteres hexadecimales

### Constantes del Sistema

```typescript
// backend/src/shared/constants/license.ts
export const LICENSE = {
  HASH_ALGORITHM: "sha256",
  HASH_ENCODING: "hex",
  SALT_PREFIX: "NEOLOGG",      // Para licencia
  SALT_SUFFIX: "93",           // Para licencia
  ROOT_PASSWORD_PREFIX: "NEOLOGG",
  ROOT_PASSWORD_SUFFIX: "TOPO",
  MQTT_PASSWORD_PREFIX: "NEOLOGG",
  MQTT_PASSWORD_SUFFIX: "TOPO",
};
```

**⚠️ IMPORTANTE:** Todos los passwords (licencia, root, MQTT) son hashes SHA-256, NO texto plano.

---

## 🔄 Provisioning

### 1. Obtener Estado del Provisioning

```http
GET /api/admin/neologg/provisioning/status
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Provisioning status retrieved successfully",
  "data": {
    "isEnabled": false,
    "temporaryCredentials": null,
    "expiresAt": null,
    "timeRemainingSeconds": null
  }
}
```

**Response cuando está ACTIVADO:**
```json
{
  "message": "Provisioning status retrieved successfully",
  "data": {
    "isEnabled": true,
    "temporaryCredentials": {
      "username": "provision_temp",
      "password": "ab3f8e9d12c..."
    },
    "expiresAt": "2026-01-15T15:30:00.000Z",
    "timeRemainingSeconds": 3600
  }
}
```

---

### 2. Activar Provisioning

```http
POST /api/admin/neologg/provisioning/toggle
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "isEnabled": true
}
```

**Response (200):**
```json
{
  "message": "Provisioning status updated successfully",
  "data": {
    "isEnabled": true,
    "temporaryCredentials": {
      "username": "provision_temp",
      "password": "f7e2a1b8c3d4e5f6a7b8c9d0e1f2a3b4"
    },
    "expiresAt": "2026-01-15T15:30:00.000Z",
    "timeRemainingSeconds": 3600
  }
}
```

---

### 3. Desactivar Provisioning

```http
POST /api/admin/neologg/provisioning/toggle
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "isEnabled": false
}
```

**Response (200):**
```json
{
  "message": "Provisioning status updated successfully",
  "data": {
    "isEnabled": false,
    "temporaryCredentials": null,
    "expiresAt": null,
    "timeRemainingSeconds": null
  }
}
```

---

### 4. Provisionar Dispositivo (Endpoint NO Protegido)

**⚠️ Este endpoint NO requiere autenticación Bearer, lo llaman los dispositivos en su primera conexión**

**⚠️ El provisioning debe estar ACTIVO para que este endpoint funcione**

```http
POST /unprotected/neologg/provision
Content-Type: application/json

{
  "serialNumber": "NL8-2512001",
  "macAddress": "00:1A:2B:3C:4D:5E",
  "imei": "123456789012345"
}
```

**Validaciones:**
- `serialNumber`: 8-32 caracteres alfanuméricos
- `macAddress`: Formato válido XX:XX:XX:XX:XX:XX o XX-XX-XX-XX-XX-XX
- `imei`: Exactamente 15 dígitos numéricos

**Generación de Credenciales:**

El backend genera automáticamente:

1. **Licencia:**
   ```
   SHA-256(SN + MAC + "NEOLOGG" + IMEI + "93")
   ```

2. **Root Password:**
   ```
   SHA-256("NEOLOGG" + SN + "TOPO")
   ```

3. **MQTT Username:**
   ```
   SN (sin hash)
   ```

4. **MQTT Password:**
   ```
   SHA-256("NEOLOGG" + SN + "TOPO" + IMEI)
   ```

**Proceso Automático en Backend:**

1. ✅ Genera todas las credenciales con las fórmulas anteriores
2. ✅ Ejecuta `mosquitto_passwd` para crear el usuario MQTT
3. ✅ Añade ACL en `/mosquitto/data/acl`:
   ```
   user {SN}
   topic readwrite production/neologg/{SN}/#
   ```
4. ✅ Recarga Mosquitto automáticamente (SIGHUP)
5. ✅ Valida duplicados (serial number único)
6. ✅ Registra eventos y errores en PostgreSQL

**Response (200):**
```json
{
  "message": "Device provisioned successfully",
  "data": {
    "deviceId": "550e8400-e29b-41d4-a716-446655440000",
    "serialNumber": "NL8-2512001",
    "license": "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
    "rootPassword": "f4e8a1c2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    "mqttUsername": "NL8-2512001",
    "mqttPassword": "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
  }
}
```

**⚠️ NOTA:** Todos los passwords son hashes SHA-256 de 64 caracteres hexadecimales.

**Posibles Errores:**

- **403 Forbidden**: El provisioning está desactivado
  ```json
  {
    "message": "Provisioning is currently disabled"
  }
  ```

- **400 Bad Request**: Credenciales temporales incorrectas
  ```json
  {
    "message": "Invalid temporary credentials"
  }
  ```

- **409 Conflict**: El dispositivo ya está provisionado
  ```json
  {
    "message": "Device already provisioned"
  }
  ```

---

## 📱 Devices

### 1. Listar Dispositivos

```http
GET /api/admin/neologg/devices
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Device list retrieved successfully",
  "data": [
    {
      "deviceId": "550e8400-e29b-41d4-a716-446655440000",
      "serialNumber": "NEOLOGG-12345678",
      "firmwareVersion": "1.0.0",
      "status": "online",
      "lastSeenAt": "2026-01-15T14:25:30.000Z",
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

**Estados posibles:**
- `online`: Dispositivo conectado y enviando heartbeats
- `offline`: Dispositivo sin conexión
- `unknown`: Estado indeterminado

---

### 2. Detalle de Dispositivo

```http
GET /api/admin/neologg/devices/{deviceId}
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Device detail retrieved successfully",
  "data": {
    "deviceId": "550e8400-e29b-41d4-a716-446655440000",
    "serialNumber": "NEOLOGG-12345678",
    "firmwareVersion": "1.0.0",
    "status": "online",
    "lastSeenAt": "2026-01-15T14:25:30.000Z",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "mqttUser": "neologg_12345678",
    "mqttTopics": {
      "publish": [...],
      "subscribe": [...]
    },
    "license": "a1b2c3d4e5f6..."
  }
}
```

---

### 3. Enviar Acción a Dispositivo

```http
POST /api/admin/neologg/devices/{deviceId}/actions
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "action": "restart"
}
```

**Acciones disponibles:**
- `restart`: Reiniciar dispositivo
- `sync_time`: Sincronizar hora
- `rotate_logs`: Rotar logs
- `request_status`: Solicitar estado

**Response (200):**
```json
{
  "message": "Action sent successfully",
  "data": {
    "actionId": "123e4567-e89b-12d3-a456-426614174000",
    "action": "restart",
    "deviceId": "550e8400-e29b-41d4-a716-446655440000",
    "sentAt": "2026-01-15T14:30:00.000Z",
    "topic": "production/neologg/NEOLOGG-12345678/actions"
  }
}
```

---

## 👥 Users

### Listar Usuarios con Perfiles

```http
GET /api/admin/users-profiles?limit=10&offset=0
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "User profiles retrieved successfully",
  "data": [
    {
      "user": {
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Super Administrator",
        "email": "superadmin@neologg.com",
        "createdAt": "2026-01-15T00:00:00.000Z"
      },
      "card": {
        "userCardId": "...",
        "phoneNumber": "123456789",
        "phonePrefix": "+34",
        "country": "Spain",
        "city": "Madrid",
        "address1": "...",
        "address2": null,
        "description": null
      },
      "roles": ["admin"],
      "sessions": [],
      "isBlacklisted": false
    }
  ]
}
```

---

## 📊 Resumen de Endpoints

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/unprotected/auth/login` | ❌ No | Login de usuario |
| GET | `/api/admin/neologg/provisioning/status` | ✅ Admin | Estado del provisioning |
| POST | `/api/admin/neologg/provisioning/toggle` | ✅ Admin | Activar/Desactivar provisioning |
| POST | `/unprotected/neologg/provision` | ❌ No | Provisionar dispositivo |
| GET | `/api/admin/neologg/devices` | ✅ Admin | Listar dispositivos |
| GET | `/api/admin/neologg/devices/{id}` | ✅ Admin | Detalle de dispositivo |
| POST | `/api/admin/neologg/devices/{id}/actions` | ✅ Admin | Enviar acción a dispositivo |
| GET | `/api/admin/users-profiles` | ✅ Admin | Listar usuarios |
| GET | `/api/user/my-user` | ✅ User | Mi perfil |

---

## 🔍 Troubleshooting

### Error 403 en Provisioning Toggle

**Problema:** Al intentar activar el provisioning, recibes un 403 Forbidden.

**Solución:**
1. Verifica que el token sea válido y no haya expirado
2. Asegúrate de que el usuario tenga el rol `admin`
3. Comprueba que la ruta sea `/api/admin/neologg/provisioning/toggle` (con `/api` al inicio)

### Error "MQTT client not connected"

**Problema:** Al enviar acciones a dispositivos, el backend no puede conectarse a Mosquitto.

**Solución:**
1. Verifica que el contenedor `neologg_cloud_mosquitto` esté en estado `healthy`
2. Comprueba los logs de Mosquitto: `docker logs neologg_cloud_mosquitto`
3. Reinicia el contenedor de backend para reconectar MQTT

### Credenciales Temporales Inválidas

**Problema:** Al provisionar un dispositivo, las credenciales temporales son rechazadas.

**Solución:**
1. Verifica que el provisioning esté activado (GET `/provisioning/status`)
2. Comprueba que las credenciales no hayan expirado (`timeRemainingSeconds > 0`)
3. Copia exactamente `username` y `password` del response del status

---

## 📝 Notas Importantes

1. **Tokens JWT**: Expiran en 1 hora. Usa el `refreshToken` para renovar.
2. **Provisioning Timeout**: Las credenciales temporales expiran en 1 hora.
3. **MQTT Topics**: Cada dispositivo tiene topics únicos basados en su `serialNumber`.
4. **Estados de Dispositivos**: Se actualizan basándose en heartbeats MQTT (cada 60 segundos).
5. **Acciones MQTT**: Se publican en el topic `production/neologg/{serialNumber}/actions`.

---

## 🚀 Flujo Completo de Provisioning

### Paso 1: Admin activa provisioning
```bash
POST /api/admin/neologg/provisioning/toggle
Authorization: Bearer {token}
Content-Type: application/json

{
  "isEnabled": true
}
```

**Response:**
```json
{
  "isEnabled": true,
  "temporaryCredentials": null,
  "expiresAt": null,
  "timeRemainingSeconds": null
}
```

**Nota:** El nuevo sistema NO usa credenciales temporales. El provisioning simplemente debe estar activo (isEnabled=true).

### Paso 2: Dispositivo se provisiona

El dispositivo envía sus datos físicos:

```bash
POST /unprotected/neologg/provision
Content-Type: application/json

{
  "serialNumber": "NL8-2512001",
  "macAddress": "00:1A:2B:3C:4D:5E",
  "imei": "123456789012345"
}
```

### Paso 3: Backend genera credenciales automáticamente

1. **Licencia:**
   ```
   SHA-256("NL8-251200100:1A:2B:3C:4D:5ENEOLOGG12345678901234593")
   = "f4e8a1c2b3d4e5f6..." (64 chars hexadecimales)
   ```

2. **Root Password:**
   ```
   SHA-256("NEOLOGGNL8-2512001TOPO")
   = "a1b2c3d4e5f6a7b8..." (64 chars hexadecimales)
   ```

3. **MQTT Username:**
   ```
   "NL8-2512001" (sin hash)
   ```

4. **MQTT Password:**
   ```
   SHA-256("NEOLOGGNL8-2512001TOPO123456789012345")
   = "c5d6e7f8a9b0c1d2..." (64 chars hexadecimales)
   ```

### Paso 4: Backend configura Mosquitto

1. Ejecuta: `mosquitto_passwd -b /mosquitto/data/passwd NL8-2512001 {mqtt_password_hash}`
2. Añade al archivo `/mosquitto/data/acl`:
   ```
   user NL8-2512001
   topic readwrite production/neologg/NL8-2512001/#
   ```
3. Recarga Mosquitto: `docker exec neologg_cloud_mosquitto kill -SIGHUP 1`

**⚠️ NOTA:** El password que se guarda en Mosquitto es el hash SHA-256 generado.

### Paso 5: Dispositivo recibe credenciales

```json
{
  "message": "Device provisioned successfully",
  "data": {
    "deviceId": "550e8400-e29b-41d4-a716-446655440000",
    "serialNumber": "NL8-2512001",
    "license": "f4e8a1c2b3d4e5f6a7b8c9d0e1f2a3b4...",
    "rootPassword": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6...",
    "mqttUsername": "NL8-2512001",
    "mqttPassword": "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0..."
  }
}
```

**⚠️ IMPORTANTE:** Todos los passwords son hashes SHA-256 de 64 caracteres.

### Paso 6: Dispositivo se conecta a MQTT

El dispositivo usa las credenciales recibidas para conectarse:
- **Broker:** `localhost:1883` (o IP del servidor)
- **Username:** `NL8-2512001`
- **Password:** `c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0...` (hash SHA-256 de 64 caracteres)
- **Topics permitidos:** `production/neologg/NL8-2512001/#` (read/write)

**⚠️ NOTA:** El dispositivo debe usar el hash SHA-256 recibido, NO el texto plano.

### Paso 7: Admin desactiva provisioning (opcional)

```bash
POST /api/admin/neologg/provisioning/toggle
Body: { "isEnabled": false }
```
