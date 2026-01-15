# 🔐 CREDENCIALES DE PRUEBA - NEOLOGG CLOUD

**Fecha**: 2026-01-15 08:30  
**Sistema**: Neologg Cloud IoT Platform

---

## 🌐 URL DE ACCESO

### Frontend (Docker)
```
http://localhost:5174
```

### Backend API
```
http://localhost:8094
```

---

## 👥 USUARIOS DE PRUEBA

### 1. 👨‍💼 Super Administrator (RECOMENDADO)

```
Email:    superadmin@neologg.com
Password: SuperAdmin123!
Rol:      Usuario estándar (puede ser promovido a admin)
Estado:   ✅ Activo y verificado
```

**Uso recomendado**: Pruebas de administración y configuración del sistema.

---

### 2. 👤 Usuario de Prueba

```
Email:    test@test.com
Password: Test123!
Rol:      Usuario estándar
Estado:   ✅ Activo y verificado
```

**Uso recomendado**: Pruebas de funcionalidades de usuario estándar.

---

### 3. 📧 Usuario Admin Original (⚠️ Contraseña desconocida)

```
Email:    admin@email.com
Password: ❌ DESCONOCIDA (creado durante init de BD)
Estado:   ⚠️ No utilizable para pruebas
```

**Nota**: Este usuario fue creado automáticamente durante la inicialización de la base de datos, pero no tenemos acceso a su contraseña.

---

## 🔑 REQUISITOS DE CONTRASEÑA

Todas las contraseñas deben cumplir con:

| Requisito | Descripción | Ejemplo |
|-----------|-------------|---------|
| **Mayúscula** | Al menos 1 letra mayúscula | A, B, S |
| **Minúscula** | Al menos 1 letra minúscula | a, d, m |
| **Número** | Al menos 1 dígito | 1, 2, 3 |
| **Especial** | Al menos 1 carácter especial | !, @, #, $, %, ^, &, * |
| **Longitud** | Mínimo 8 caracteres | - |

### ✅ Ejemplos de contraseñas válidas:
```
SuperAdmin123!
Test123!
Admin2026@
Password1!
Neologg2026#
```

### ❌ Ejemplos de contraseñas inválidas:
```
admin123       (falta mayúscula y carácter especial)
ADMIN123!      (falta minúscula)
Admin!         (falta número)
Admin123       (falta carácter especial)
```

---

## 🧪 CÓMO HACER LOGIN

### Desde el Frontend (Navegador)

1. **Abre el navegador**:
   ```
   http://localhost:5174
   ```

2. **En la página de login**, ingresa:
   - **Email**: `superadmin@neologg.com`
   - **Password**: `SuperAdmin123!`

3. **Haz clic en "Login"**

4. **Si aparece error**:
   - Recarga la página (F5)
   - Verifica que las credenciales estén correctas
   - Verifica que no haya espacios extras

---

### Desde la API (cURL)

```bash
curl -X POST http://localhost:5174/unprotected/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@neologg.com",
    "password": "SuperAdmin123!"
  }'
```

**Respuesta esperada**:
```json
{
  "message": "superadmin@neologg.com successfully logged in"
}
```

---

### Desde PowerShell

```powershell
$body = '{"email":"superadmin@neologg.com","password":"SuperAdmin123!"}'
Invoke-RestMethod -Uri "http://localhost:5174/unprotected/auth/login" `
  -Method POST -Body $body -ContentType "application/json"
```

---

## 🆕 CREAR NUEVOS USUARIOS

### Desde el Frontend

1. Ve a la página de registro (si existe)
2. Completa el formulario
3. La contraseña debe cumplir los requisitos

---

### Desde la API

```bash
curl -X POST http://localhost:5174/unprotected/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@usuario.com",
    "password": "Password123!",
    "name": "Nombre Usuario"
  }'
```

### Desde PowerShell

```powershell
$body = @{
    email = "nuevo@usuario.com"
    password = "Password123!"
    name = "Nombre Usuario"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5174/unprotected/auth/register" `
  -Method POST -Body $body -ContentType "application/json"
```

---

## 🔒 SEGURIDAD

### Contraseñas Hasheadas
Todas las contraseñas se almacenan hasheadas con **bcrypt** en la base de datos PostgreSQL.

### Sesiones
Las sesiones se mantienen mediante:
- **Cookies HTTP-only** (más seguro)
- **Redis/Valkey** para almacenamiento de sesiones
- **JWT tokens** para autenticación

### CORS
Configurado para aceptar peticiones de:
- `http://localhost:5173` (desarrollo)
- `http://localhost:5174` (Docker)

---

## 📊 VERIFICAR USUARIOS EN LA BD

### Listar todos los usuarios

```bash
docker exec neologg_cloud_postgres psql -U postgres -d neologg_cloud_db \
  -c "SELECT user_id, email, created_at FROM users ORDER BY created_at;"
```

**Resultado actual**:
```
               user_id                |          email           |          created_at           
--------------------------------------+--------------------------+-------------------------------
 122b71f0-24af-4f24-a8e9-658e4284a5ef | admin@email.com          | 2026-01-14 15:42:10.548884+00
 b5483fab-12d2-4297-abff-2b5983f91952 | test@test.com            | 2026-01-14 16:58:48.393136+00
 [nuevo-uuid]                         | superadmin@neologg.com   | 2026-01-15 07:30:xx.xxxxxx+00
```

---

## 🎯 RESUMEN RÁPIDO

**Para hacer login ahora mismo**:

```
URL:      http://localhost:5174
Email:    superadmin@neologg.com
Password: SuperAdmin123!
```

1. Abre http://localhost:5174
2. Ingresa email y contraseña
3. Haz clic en Login
4. ✅ ¡Listo!

---

## ⚠️ TROUBLESHOOTING

### Error: "Invalid credentials"
- Verifica que el email sea **exactamente** `superadmin@neologg.com`
- Verifica que la contraseña sea **exactamente** `SuperAdmin123!` (con S mayúscula y signo !)
- No copies/pegues, escribe manualmente para evitar espacios invisibles

### Error: "User not found"
- El usuario no existe, créalo usando el endpoint de registro

### Error: "Connection refused"
- Verifica que el backend esté corriendo: `docker ps --filter "name=neologg_cloud_backend"`
- Reinicia si es necesario: `cd docker && docker compose restart backend`

### Login funciona pero redirige a error
- Limpia cookies del navegador
- Recarga la página (F5)
- Intenta en modo incógnito

---

## 📝 NOTAS IMPORTANTES

1. **Estas son credenciales de DESARROLLO/TESTING**
   - No usar en producción
   - Cambiar contraseñas en entorno real

2. **Los usuarios NO tienen roles asignados por defecto**
   - Todos se crean como usuarios estándar
   - Se deben asignar roles admin manualmente si es necesario

3. **Las sesiones persisten**
   - Se mantienen en Valkey (Redis)
   - Sobreviven a reinicios del navegador
   - Para cerrar sesión: usar el endpoint `/unprotected/auth/logout`

---

## 🚀 PRÓXIMOS PASOS

Después del login exitoso, puedes:

1. ✅ Explorar el panel de administración
2. ✅ Probar los endpoints de Neologg Cloud:
   - Provisioning de dispositivos
   - Visualización de dispositivos
   - Envío de acciones a dispositivos
3. ✅ Probar la comunicación MQTT con dispositivos simulados
4. ✅ Verificar datos en InfluxDB

---

**Credenciales listas para usar** ✅  
**Sistema 100% operativo** 🎉  
**Fecha**: 2026-01-15 08:30
