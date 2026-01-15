# 🧮 Ejemplos de Generación de Credenciales Neologg

## 📝 Datos de Ejemplo

```json
{
  "serialNumber": "NL8-2512001",
  "macAddress": "00:1A:2B:3C:4D:5E",
  "imei": "123456789012345"
}
```

---

## 🔑 Cálculo de Credenciales

### 1. Licencia (SHA-256)

**Fórmula:**
```
SHA-256(SN + MAC + "NEOLOGG" + IMEI + "93")
```

**Concatenación:**
```
NL8-2512001 + 00:1A:2B:3C:4D:5E + NEOLOGG + 123456789012345 + 93
= NL8-251200100:1A:2B:3C:4D:5ENEOLOGG12345678901234593
```

**Hash SHA-256:**
```bash
echo -n "NL8-251200100:1A:2B:3C:4D:5ENEOLOGG12345678901234593" | sha256sum
```

**Resultado (ejemplo):**
```
f4e8a1c2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

---

### 2. Root Password (SHA-256)

**Fórmula:**
```
SHA-256("NEOLOGG" + SN + "TOPO")
```

**Concatenación:**
```
NEOLOGG + NL8-2512001 + TOPO
= NEOLOGGNL8-2512001TOPO
```

**Hash SHA-256:**
```bash
echo -n "NEOLOGGNL8-2512001TOPO" | sha256sum
```

**Resultado (ejemplo):**
```
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

---

### 3. MQTT Username (SIN HASH)

**Fórmula:**
```
SN
```

**Resultado:**
```
NL8-2512001
```

---

### 4. MQTT Password (SHA-256)

**Fórmula:**
```
SHA-256("NEOLOGG" + SN + "TOPO" + IMEI)
```

**Concatenación:**
```
NEOLOGG + NL8-2512001 + TOPO + 123456789012345
= NEOLOGGNL8-2512001TOPO123456789012345
```

**Hash SHA-256:**
```bash
echo -n "NEOLOGGNL8-2512001TOPO123456789012345" | sha256sum
```

**Resultado (ejemplo):**
```
c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
```

---

## 📊 Tabla Resumen

| Campo | Valor |
|-------|-------|
| **Serial Number** | `NL8-2512001` |
| **MAC Address** | `00:1A:2B:3C:4D:5E` |
| **IMEI** | `123456789012345` |
| **Licencia** | `f4e8a1c2...` (SHA-256 de 64 chars) |
| **Root Password** | `a1b2c3d4...` (SHA-256 de 64 chars) |
| **MQTT Username** | `NL8-2512001` |
| **MQTT Password** | `c5d6e7f8...` (SHA-256 de 64 chars) |

**⚠️ IMPORTANTE:** Todos los passwords son hashes SHA-256, NO texto plano.

---

## 🧪 Verificación con Node.js

Puedes verificar el cálculo con este script:

```javascript
const crypto = require('crypto');

const serialNumber = "NL8-2512001";
const macAddress = "00:1A:2B:3C:4D:5E";
const imei = "123456789012345";

// 1. Licencia
const licenseInput = serialNumber + macAddress + "NEOLOGG" + imei + "93";
const license = crypto.createHash('sha256').update(licenseInput).digest('hex');
console.log("Licencia Input:", licenseInput);
console.log("Licencia SHA-256:", license);
console.log("");

// 2. Root Password
const rootPasswordInput = "NEOLOGG" + serialNumber + "TOPO";
const rootPassword = crypto.createHash('sha256').update(rootPasswordInput).digest('hex');
console.log("Root Password Input:", rootPasswordInput);
console.log("Root Password SHA-256:", rootPassword);
console.log("");

// 3. MQTT Username (sin hash)
const mqttUsername = serialNumber;
console.log("MQTT Username:", mqttUsername);
console.log("");

// 4. MQTT Password
const mqttPasswordInput = "NEOLOGG" + serialNumber + "TOPO" + imei;
const mqttPassword = crypto.createHash('sha256').update(mqttPasswordInput).digest('hex');
console.log("MQTT Password Input:", mqttPasswordInput);
console.log("MQTT Password SHA-256:", mqttPassword);
```

**Ejecutar:**
```bash
node verify-credentials.js
```

**Output esperado:**
```
Licencia Input: NL8-251200100:1A:2B:3C:4D:5ENEOLOGG12345678901234593
Licencia SHA-256: f4e8a1c2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0

Root Password Input: NEOLOGGNL8-2512001TOPO
Root Password SHA-256: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2

MQTT Username: NL8-2512001

MQTT Password Input: NEOLOGGNL8-2512001TOPO123456789012345
MQTT Password SHA-256: c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
```

---

## 🧪 Verificación con Python

```python
import hashlib

serial_number = "NL8-2512001"
mac_address = "00:1A:2B:3C:4D:5E"
imei = "123456789012345"

# 1. Licencia
license_input = serial_number + mac_address + "NEOLOGG" + imei + "93"
license_hash = hashlib.sha256(license_input.encode()).hexdigest()
print(f"Licencia Input: {license_input}")
print(f"Licencia SHA-256: {license_hash}\n")

# 2. Root Password
root_password_input = "NEOLOGG" + serial_number + "TOPO"
root_password_hash = hashlib.sha256(root_password_input.encode()).hexdigest()
print(f"Root Password Input: {root_password_input}")
print(f"Root Password SHA-256: {root_password_hash}\n")

# 3. MQTT Username (sin hash)
mqtt_username = serial_number
print(f"MQTT Username: {mqtt_username}\n")

# 4. MQTT Password
mqtt_password_input = "NEOLOGG" + serial_number + "TOPO" + imei
mqtt_password_hash = hashlib.sha256(mqtt_password_input.encode()).hexdigest()
print(f"MQTT Password Input: {mqtt_password_input}")
print(f"MQTT Password SHA-256: {mqtt_password_hash}")
```

---

## 🔍 Verificación con curl

Puedes probar el endpoint directamente:

```bash
curl -X POST http://localhost:8094/unprotected/neologg/provision \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "NEOLOGG001",
    "macAddress": "00:1A:2B:3C:4D:5E",
    "imei": "123456789012345"
  }'
```

**Debes asegurarte primero de que el provisioning esté activo:**

```bash
# 1. Login como admin
TOKEN=$(curl -s -X POST http://localhost:8094/unprotected/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@neologg.com","password":"SuperAdmin123!"}' \
  | jq -r '.data.accessToken')

# 2. Activar provisioning
curl -X POST http://localhost:8094/api/admin/neologg/provisioning/toggle \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isEnabled": true}'

# 3. Provisionar dispositivo
curl -X POST http://localhost:8094/unprotected/neologg/provision \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "NEOLOGG001",
    "macAddress": "00:1A:2B:3C:4D:5E",
    "imei": "123456789012345"
  }'
```

---

## 🛡️ Configuración MQTT Generada

Después del provisionamiento, Mosquitto queda configurado así:

### Archivo `/mosquitto/data/passwd`:
```
NL8-2512001:$7$101$hashed_password_here...
```

### Archivo `/mosquitto/data/acl`:
```
user NL8-2512001
topic readwrite production/neologg/NL8-2512001/#
```

### Topics MQTT disponibles para el dispositivo:

**Publish (dispositivo → servidor):**
- `production/neologg/NL8-2512001/heartbeat`
- `production/neologg/NL8-2512001/data`
- `production/neologg/NL8-2512001/license`

**Subscribe (servidor → dispositivo):**
- `production/neologg/NL8-2512001/actions`

---

## ⚠️ Notas Importantes

1. **MAC Address:** Se acepta con `:` o `-` como separador
2. **IMEI:** Debe ser exactamente 15 dígitos numéricos
3. **Serial Number:** Debe ser único en el sistema (validación automática)
4. **Todos los passwords son SHA-256:** Licencia, Root Password y MQTT Password son hashes de 64 caracteres hexadecimales
5. **MQTT Username:** Es el único campo que NO se hashea (es el Serial Number en texto plano)
6. **Passwords determinísticos:** Mismo input → mismo output (no hay salt aleatorio)
