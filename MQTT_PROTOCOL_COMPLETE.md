# 📡 Protocolo MQTT - Dispositivos NeoLogg

## 📤 Topics que PUBLICA el Dispositivo

### 1. `/status` - Estado del Dispositivo (LWT)
**Topic:** `production/neologg/{SerialNumber}/status`  
**QoS:** 1  
**Retain:** ✅ Sí

**Configurar en LWT antes de conectar:**
```
Topic: production/neologg/NL8-2512014/status
Message: offlinelwt
QoS: 1
Retain: true
```

**Publicar después de conectar exitosamente:**
```
online
```
(Texto plano, SIN comillas)

**Publicar antes de desconectar controladamente:**
```
offline
```
(Texto plano, SIN comillas)

**Estados disponibles:**
- `online`: El dispositivo se conectó correctamente ✅ Actualiza `last_seen_at`
- `offline`: El dispositivo se apagó de forma controlada ✅ Actualiza `last_seen_at`
- `offlinelwt`: El dispositivo perdió la conexión (enviado por el broker) ❌ NO actualiza `last_seen_at`

---

### 2. `/heartbeat` - Ping de Vida
**Topic:** `production/neologg/{SerialNumber}/heartbeat`  
**QoS:** 1  
**Retain:** No

**Mensaje:**
```
ping
```

**Frecuencia:** Cada 30-60 segundos (opcional)

---

### 3. `/data` - Datos de Sensores
**Topic:** `production/neologg/{SerialNumber}/data`  
**QoS:** 1  
**Retain:** No

**Mensaje (JSON):**
```json
{
  "timestamp": "2026-01-15T16:30:00Z",
  "temperature": 23.5,
  "humidity": 65.2,
  "pressure": 1013.25,
  "battery_voltage": 3.7,
  "signal_strength": -65
}
```

**Frecuencia:** Según necesidad (cada 1-5 minutos)

---

### 4. `/license` - Validación de Licencia
**Topic:** `production/neologg/{SerialNumber}/license`  
**QoS:** 1  
**Retain:** No

**Mensaje (String):**
```
8bfdeb3d7d0ce654c135c4ca1ac8b1cb7a62385641dd2b5ad16efc6c686d3bf5
```

---

### 5. `/info` - Información de Hardware y Firmware
**Topic:** `production/neologg/{SerialNumber}/info`  
**QoS:** 1  
**Retain:** ✅ Sí (para mantener la última versión)

**Mensaje (JSON):**
```json
{
  "firmware_version": "1.0.0",
  "hardware_version": "NL8-v2.1"
}
```

**Cuándo publicar:**
- Al conectar por primera vez
- Después de una actualización de firmware
- Cuando cambie la versión de hardware (raro)

**Ejemplo:**
```
Topic: production/neologg/NL8-2512014/info
Mensaje: {"firmware_version":"1.0.0","hardware_version":"NL8-v2.1"}
QoS: 1
Retain: true
```

---

## 📥 Topics a los que se SUSCRIBE el Dispositivo

### `/actions/{action}` - Comandos del Sistema
**Topic Pattern:** `production/neologg/{SerialNumber}/actions/#`

El dispositivo debe suscribirse a este pattern para recibir **todos** los comandos.

**Topics específicos:**
- `production/neologg/{SerialNumber}/actions/restart`
- `production/neologg/{SerialNumber}/actions/sync_time`
- `production/neologg/{SerialNumber}/actions/rotate_logs`
- `production/neologg/{SerialNumber}/actions/request_status`

**El tipo de acción ahora está en el topic, no en el JSON del mensaje.**

---

## ⚡ Comandos Disponibles (Recibidos en `/actions/*`)

### 1. Reiniciar Dispositivo
**Topic:** `production/neologg/NL8-2512014/actions/restart`

**Mensaje:**
```json
{
  "timestamp": "2026-01-15T16:30:00.000Z"
}
```

---

### 2. Sincronizar Hora
**Topic:** `production/neologg/NL8-2512014/actions/sync_time`

**Mensaje:**
```json
{
  "timestamp": 1737823800,
  "timezone": "UTC"
}
```

---

### 3. Rotar Logs
**Topic:** `production/neologg/NL8-2512014/actions/rotate_logs`

**Mensaje:**
```json
{
  "timestamp": "2026-01-15T16:30:00.000Z"
}
```

---

### 4. Solicitar Estado Completo
**Topic:** `production/neologg/NL8-2512014/actions/request_status`

**Mensaje:**
```json
{
  "timestamp": "2026-01-15T16:30:00.000Z"
}
```

**Respuesta esperada (publicar en `/data`):**
```json
{
  "online": true,
  "firmware_version": "1.0.0",
  "uptime_seconds": 86400,
  "free_memory": 45000,
  "wifi_rssi": -65,
  "battery_voltage": 3.7,
  "temperature": 23.5,
  "humidity": 65.2,
  "last_error": null
}
```

---

## 📋 Resumen

| Topic | Dirección | Tipo de Dato | Retain | Actualiza `last_seen_at` |
|-------|-----------|--------------|--------|--------------------------|
| `/status` | Publicar | String: `online`, `offline` o `offlinelwt` | ✅ | `online`/`offline` ✅, `offlinelwt` ❌ |
| `/heartbeat` | Publicar | String: `ping` | ❌ | ✅ |
| `/data` | Publicar | JSON | ❌ | ✅ |
| `/license` | Publicar | String (SHA-256) | ❌ | ✅ |
| `/info` | Publicar | JSON: `{"firmware_version", "hardware_version"}` | ✅ | ✅ |
| `/actions/*` | Suscribirse | JSON | ❌ | ❌ |

**Nota:** 
- Cualquier mensaje que el dispositivo **publique** (excepto respuestas a `/actions/*`) actualiza `last_seen_at`, **EXCEPTO** `offlinelwt` que lo envía el broker.
- El tipo de acción ahora está en el topic (`/actions/restart`, `/actions/sync_time`, etc.) no en el JSON.

---

## 🔑 Credenciales

Al aprovisionar un dispositivo, recibes:

```json
{
  "serialNumber": "NL8-2512014",
  "mqttUsername": "NL8-2512014",
  "mqttPassword": "983de5cc6aadfe6691cff6c35d742905dff06aa8ba88bfad08126c445e788594"
}
```

**Broker:** `mosquitto:1883` (o la IP/dominio del servidor)  
**Keep-Alive:** 60 segundos

---

## ✅ Checklist de Implementación

- [ ] Configurar LWT antes de conectar (`/status` = `offlinelwt`)
- [ ] Publicar `online` en `/status` después de conectar
- [ ] **Publicar información de hardware/firmware en `/info` (con retain)**
- [ ] **Suscribirse al pattern `/actions/#` para recibir todos los comandos**
- [ ] Enviar heartbeat cada 30-60 segundos (opcional)
- [ ] Enviar datos de sensores en `/data`
- [ ] **Procesar comandos según el topic recibido** (`/actions/restart`, `/actions/sync_time`, etc.)
- [ ] Publicar `offline` antes de desconectar (o dejar que LWT envíe `offlinelwt`)
