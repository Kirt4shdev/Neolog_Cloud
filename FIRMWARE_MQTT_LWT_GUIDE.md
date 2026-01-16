# 📡 Guía MQTT para Firmware - Dispositivos NeoLogg

## 🔌 Conexión al Broker

**Broker:** `mqtt.neologg.com` (o IP del servidor)  
**Puerto:** `1883`  
**Usuario:** Tu Serial Number (ej: `NL8-2512014`)  
**Contraseña:** SHA-256 provisto al aprovisionar  
**Keep-Alive:** 60 segundos

---

## 🛡️ Configurar LWT (Last Will and Testament)

**ANTES de conectar**, configura el LWT:

```
Topic: production/neologg/{TU_SERIAL}/status
Message: offlinelwt
QoS: 1
Retain: true
```

**Ejemplo para ESP32/Arduino:**
```cpp
// Configurar LWT antes de client.connect()
client.setWill("production/neologg/NL8-2512014/status", "offlinelwt", 1, true);

// Luego conectar
if (client.connect("NL8-2512014", "tu_usuario", "tu_password")) {
  Serial.println("Conectado!");
  
  // IMPORTANTE: Publicar online inmediatamente después de conectar
  client.publish("production/neologg/NL8-2512014/status", "online", true);
  
  // Suscribirse a comandos
  client.subscribe("production/neologg/NL8-2512014/actions");
}
```

---

## 📤 Topics que DEBES PUBLICAR

### 1. `/status` - Estado del Dispositivo

**Cuándo publicar:**
- `online` → Justo después de conectar ✅
- `offline` → Antes de desconectar voluntariamente ✅
- `offlinelwt` → **NO lo publiques tú**, lo envía el broker si pierdes conexión ⚠️

**Ejemplo:**
```cpp
// Al conectar
client.publish("production/neologg/NL8-2512014/status", "online", true);

// Antes de desconectar (apagado controlado)
client.publish("production/neologg/NL8-2512014/status", "offline", true);
client.disconnect();
```

**IMPORTANTE:** Usa texto plano **SIN comillas**. ✅ `online` ❌ `"online"`

---

### 2. `/heartbeat` - Ping de Vida (OPCIONAL)

Si quieres enviar heartbeats manuales cada 30-60 segundos:

```cpp
client.publish("production/neologg/NL8-2512014/heartbeat", "ping");
```

> **Nota:** Con el LWT y el keep-alive de 60s, esto es **opcional**.

---

### 3. `/data` - Datos de Sensores

**Formato:** JSON  
**Frecuencia:** Según necesidad (cada 1-5 minutos)

```cpp
String payload = "{\"timestamp\":\"2026-01-16T08:30:00Z\",\"temperature\":23.5,\"humidity\":65.2,\"battery_voltage\":3.7}";
client.publish("production/neologg/NL8-2512014/data", payload.c_str());
```

---

### 4. `/license` - Validación de Licencia (OPCIONAL)

Puedes enviar tu licencia SHA-256 al conectar:

```cpp
client.publish("production/neologg/NL8-2512014/license", "tu_licencia_sha256_aqui");
```

---

## 📥 Topic al que DEBES SUSCRIBIRTE

### `/actions` - Comandos del Sistema

```cpp
client.subscribe("production/neologg/NL8-2512014/actions");
```

**Mensajes que recibirás (JSON):**

#### 1. Reiniciar Dispositivo
```json
{"action":"restart","payload":null,"timestamp":"2026-01-16T08:30:00.000Z"}
```

**Qué hacer:** Ejecuta `ESP.restart()` o `NVIC_SystemReset()`

---

#### 2. Sincronizar Hora
```json
{"action":"sync_time","payload":{"timestamp":1737823800,"timezone":"UTC"},"timestamp":"2026-01-16T08:30:00.000Z"}
```

**Qué hacer:** Ajusta tu RTC o timeClient con el timestamp provisto.

---

#### 3. Rotar Logs
```json
{"action":"rotate_logs","payload":null,"timestamp":"2026-01-16T08:30:00.000Z"}
```

**Qué hacer:** Limpia o archiva tus logs internos.

---

#### 4. Solicitar Estado Completo
```json
{"action":"request_status","payload":null,"timestamp":"2026-01-16T08:30:00.000Z"}
```

**Qué hacer:** Publica un mensaje en `/data` con toda tu información:

```cpp
String status = "{\"online\":true,\"firmware_version\":\"1.0.0\",\"uptime_seconds\":86400,\"free_memory\":45000,\"wifi_rssi\":-65,\"battery_voltage\":3.7,\"temperature\":23.5,\"humidity\":65.2,\"last_error\":null}";
client.publish("production/neologg/NL8-2512014/data", status.c_str());
```

---

## 📊 ¿Qué Actualiza `last_seen_at` en la Base de Datos?

| Mensaje que TÚ Publicas | Actualiza `last_seen_at` |
|--------------------------|--------------------------|
| `/status` → `online` | ✅ SÍ |
| `/status` → `offline` | ✅ SÍ |
| `/status` → `offlinelwt` | ❌ NO (lo envía el broker, no tú) |
| `/heartbeat` → `ping` | ✅ SÍ |
| `/data` → JSON | ✅ SÍ |
| `/license` → SHA-256 | ✅ SÍ |
| `/actions` → respuesta | ❌ NO (los comandos los envía el servidor) |

---

## ✅ Checklist de Implementación

- [ ] Configurar LWT **antes** de `client.connect()` con mensaje `offlinelwt`
- [ ] Publicar `online` en `/status` **inmediatamente después** de conectar
- [ ] Suscribirse a `production/neologg/{SERIAL}/actions`
- [ ] Procesar comandos JSON recibidos en `/actions`
- [ ] Enviar datos de sensores en `/data` periódicamente
- [ ] (Opcional) Enviar heartbeat cada 30-60s
- [ ] (Opcional) Enviar licencia SHA-256 al conectar
- [ ] Publicar `offline` en `/status` antes de desconectar (si es apagado controlado)

---

## 🐛 Troubleshooting

### ❌ "El dispositivo no aparece online en el panel"
- Verifica que publicaste `online` (texto plano, sin comillas) en `/status`
- Verifica que el topic sea `production/neologg/{TU_SERIAL}/status`

### ❌ "El estado queda en offlinelwt aunque estoy conectado"
- Publica `online` justo después de conectar
- Asegúrate de que el keep-alive esté en 60s

### ❌ "No recibo comandos en /actions"
- Verifica que te suscribiste al topic `production/neologg/{TU_SERIAL}/actions`
- Revisa que el callback de MQTT esté configurado correctamente

---

## 📚 Ejemplo Completo (ESP32 + PubSubClient)

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* mqtt_server = "mqtt.neologg.com";
const char* mqtt_user = "NL8-2512014";
const char* mqtt_pass = "tu_password_sha256";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == "production/neologg/NL8-2512014/actions") {
    // Parsear JSON y ejecutar acción
    Serial.println("Comando recibido: " + message);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    
    // Configurar LWT ANTES de conectar
    client.setWill("production/neologg/NL8-2512014/status", "offlinelwt", 1, true);
    
    if (client.connect("NL8-2512014", mqtt_user, mqtt_pass)) {
      Serial.println("Conectado!");
      
      // Publicar online inmediatamente
      client.publish("production/neologg/NL8-2512014/status", "online", true);
      
      // Suscribirse a comandos
      client.subscribe("production/neologg/NL8-2512014/actions");
    } else {
      Serial.print("Falló, rc=");
      Serial.print(client.state());
      Serial.println(" Reintentando en 5 segundos...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin("tu_wifi_ssid", "tu_wifi_password");
  
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  client.setKeepAlive(60);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Enviar datos cada 60 segundos
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 60000) {
    String payload = "{\"temperature\":23.5,\"humidity\":65.2}";
    client.publish("production/neologg/NL8-2512014/data", payload.c_str());
    lastSend = millis();
  }
}
```

---

## 🎯 Resumen Rápido

1. **Configura LWT** antes de conectar: `offlinelwt`
2. **Publica `online`** después de conectar
3. **Suscríbete** a `/actions`
4. **Envía datos** a `/data` periódicamente
5. **Publica `offline`** antes de apagar (opcional, el LWT lo hace automáticamente)

¡Listo! 🚀
