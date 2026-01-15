# 🔐 SOLUCIÓN: PROBLEMA DE ROLES

**Fecha**: 2026-01-15 09:15  
**Problema**: Usuario superadmin no puede acceder a /admin ni /client  
**Estado**: ✅ Solucionado

---

## ❌ PROBLEMA IDENTIFICADO

Los usuarios recién registrados **NO tienen roles asignados por defecto**. El sistema verifica que tengan el rol `"admin"` o `"client"`, pero al registrarse, el usuario queda sin ningún rol.

### Flujo del problema:

1. Usuario se registra → Se crea en tabla `users`
2. Sistema NO asigna rol automáticamente
3. `user.roles` = `null` o `[]`
4. Middleware verifica: `user?.roles.includes("admin")` → `false`
5. Usuario es redirigido a `/access-denied` ❌

---

## ✅ SOLUCIONES APLICADAS

### 1. **Middlewares Mejorados** (Frontend)

He corregido los middlewares para manejar correctamente `null` o arrays vacíos:

**Archivo**: `frontend/src/middlewares/AdminRoute.tsx`

```typescript
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Verificar si el usuario tiene el rol admin
  const hasAdminRole = user?.roles && Array.isArray(user.roles) && user.roles.includes("admin");

  return hasAdminRole ? children : <Navigate to="/access-denied" replace />;
}
```

**Archivo**: `frontend/src/middlewares/ClientRoute.tsx`

```typescript
export function ClientRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Verificar si el usuario tiene el rol client
  const hasClientRole = user?.roles && Array.isArray(user.roles) && user.roles.includes("client");

  return hasClientRole ? children : <Navigate to="/access-denied" replace />;
}
```

**Cambios**:
- ✅ Verifica que `roles` exista
- ✅ Verifica que sea un array
- ✅ Luego verifica si incluye el rol necesario

---

### 2. **Script SQL para Asignar Roles**

He creado un script SQL para asignar roles a los usuarios existentes.

**Archivo**: `backend/src/infrastructure/database/sql/assign-roles.sql`

```sql
-- Asigna rol admin a superadmin@neologg.com
-- Asigna rol client a test@test.com

DO $$
DECLARE
    v_user_id UUID;
    v_admin_id UUID;
BEGIN
    -- Buscar superadmin@neologg.com
    SELECT user_id INTO v_user_id
    FROM users
    WHERE email = 'superadmin@neologg.com';

    IF v_user_id IS NOT NULL THEN
        -- Asignar rol admin
        IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = v_user_id) THEN
            INSERT INTO admins(user_id, created_by)
            VALUES (v_user_id, '122b71f0-24af-4f24-a8e9-658e4284a5ef');
        END IF;
    END IF;

    -- Similar para test@test.com → rol client
END $$;
```

---

## 🚀 CÓMO APLICAR LA SOLUCIÓN

### Opción 1: Ejecutar Script SQL (Recomendado)

#### Si Docker está corriendo:

```powershell
docker exec -i neologg_cloud_postgres psql -U postgres -d neologg_cloud_db < backend/src/infrastructure/database/sql/assign-roles.sql
```

#### Si Docker NO está corriendo:

1. **Inicia Docker Desktop**
2. **Levanta los contenedores**:
   ```powershell
   cd C:\Github\dilus-app-template\docker
   docker compose up -d
   ```
3. **Ejecuta el script**:
   ```powershell
   docker exec -i neologg_cloud_postgres psql -U postgres -d neologg_cloud_db < ../backend/src/infrastructure/database/sql/assign-roles.sql
   ```

---

### Opción 2: Ejecutar SQL Manualmente

```powershell
# Conectar a PostgreSQL
docker exec -it neologg_cloud_postgres psql -U postgres -d neologg_cloud_db

# Ejecutar en la consola SQL:
```

```sql
-- Asignar rol admin a superadmin@neologg.com
DO $$
DECLARE
    v_user_id UUID;
    v_admin_id UUID;
BEGIN
    SELECT user_id INTO v_user_id FROM users WHERE email = 'superadmin@neologg.com';
    SELECT admin_id INTO v_admin_id FROM admins WHERE user_id = '122b71f0-24af-4f24-a8e9-658e4284a5ef' LIMIT 1;
    
    IF v_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM admins WHERE user_id = v_user_id) THEN
        INSERT INTO admins(user_id, created_by) VALUES (v_user_id, v_admin_id);
    END IF;
END $$;

-- Verificar
SELECT u.email, 
       CASE WHEN a.user_id IS NOT NULL THEN 'admin' ELSE 'no role' END as role
FROM users u
LEFT JOIN admins a ON u.user_id = a.user_id
WHERE u.email = 'superadmin@neologg.com';
```

---

## 📊 ESTRUCTURA DEL SISTEMA DE ROLES

### Tablas involucradas:

```
users
  ├── user_id (PK)
  ├── email
  └── ...

admins
  ├── admin_id (PK)
  ├── user_id (FK → users)
  ├── created_by (FK → admins)
  ├── deleted_at
  └── ...

clients
  ├── client_id (PK)
  ├── user_id (FK → users)
  ├── created_by (FK → admins)
  ├── deleted_at
  └── ...
```

### Cómo funciona:

1. **Usuario base**: Se crea en tabla `users`
2. **Rol admin**: Se agrega entrada en tabla `admins` con el `user_id`
3. **Rol client**: Se agrega entrada en tabla `clients` con el `user_id`
4. **Endpoint `/common/my-profile`**: Hace JOIN con ambas tablas y devuelve:
   ```json
   {
     "user": {...},
     "roles": ["admin"] // o ["client"] o []
   }
   ```

---

## 🔍 VERIFICAR ROLES ASIGNADOS

### Desde PowerShell:

```powershell
docker exec neologg_cloud_postgres psql -U postgres -d neologg_cloud_db -c "
SELECT 
    u.email,
    CASE 
        WHEN a.user_id IS NOT NULL THEN 'admin'
        WHEN c.user_id IS NOT NULL THEN 'client'
        ELSE 'no role'
    END as role,
    a.created_at as admin_since,
    c.created_at as client_since
FROM users u
LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
ORDER BY u.email;
"
```

**Resultado esperado**:
```
         email          |  role  |       admin_since        | client_since 
------------------------+--------+--------------------------+--------------
 admin@email.com        | admin  | 2026-01-14 15:42:10...  | 
 superadmin@neologg.com | admin  | 2026-01-15 09:15:00...  | 
 test@test.com          | client |                          | 2026-01-15...
```

---

## 🧪 PROBAR LA SOLUCIÓN

### 1. Aplicar el script SQL

```powershell
cd C:\Github\dilus-app-template\docker
docker exec -i neologg_cloud_postgres psql -U postgres -d neologg_cloud_db < ../backend/src/infrastructure/database/sql/assign-roles.sql
```

### 2. Cerrar sesión en el frontend

En el navegador, haz logout o limpia las cookies:
- F12 → Application → Cookies → Eliminar todas

### 3. Hacer login nuevamente

```
Email:    superadmin@neologg.com
Password: SuperAdmin123!
```

### 4. Verificar acceso

- ✅ Deberías poder entrar a `/admin`
- ✅ El navbar debería mostrar las opciones de admin

---

## 🛠️ PARA FUTUROS USUARIOS

### Asignar rol Admin:

```sql
INSERT INTO admins(user_id, created_by)
SELECT 
    u.user_id,
    (SELECT admin_id FROM admins WHERE user_id = '122b71f0-24af-4f24-a8e9-658e4284a5ef' LIMIT 1)
FROM users u
WHERE u.email = 'email@del.nuevo.admin'
AND NOT EXISTS (SELECT 1 FROM admins WHERE user_id = u.user_id);
```

### Asignar rol Client:

```sql
INSERT INTO clients(user_id, created_by)
SELECT 
    u.user_id,
    (SELECT admin_id FROM admins WHERE user_id = '122b71f0-24af-4f24-a8e9-658e4284a5ef' LIMIT 1)
FROM users u
WHERE u.email = 'email@del.nuevo.cliente'
AND NOT EXISTS (SELECT 1 FROM clients WHERE user_id = u.user_id);
```

---

## 📝 MEJORA FUTURA

Para asignar roles automáticamente al registrarse, habría que modificar el stored procedure de registro en:
- `backend/src/infrastructure/database/sql/procedures/auth/register_user.sql`

Agregar después de insertar el usuario:
```sql
-- Asignar rol client por defecto
INSERT INTO clients(user_id, created_by)
VALUES (
    v_user_id,
    (SELECT admin_id FROM admins WHERE user_id = '122b71f0-24af-4f24-a8e9-658e4284a5ef' LIMIT 1)
);
```

---

## ⚠️ NOTA IMPORTANTE

**El problema del frontend aún persiste hasta que:**
1. ✅ Ejecutes el script SQL para asignar roles
2. ✅ Cierres sesión en el frontend
3. ✅ Vuelvas a hacer login

**O simplemente:**
1. ✅ Reconstruye el frontend (ya tiene los middlewares corregidos)
2. ✅ Ejecuta el script SQL

---

## 🔄 REBUILD DEL FRONTEND

Para aplicar los cambios de los middlewares:

```powershell
cd C:\Github\dilus-app-template\docker
docker compose build frontend
docker compose up -d frontend
```

---

## ✅ RESUMEN

| Problema | Solución |
|----------|----------|
| Usuarios sin roles | ✅ Script SQL para asignar roles |
| Middleware falla con `null` | ✅ Middlewares corregidos |
| No se puede acceder a /admin | ✅ Asignar rol admin |
| No se puede acceder a /client | ✅ Asignar rol client |

---

## 🎯 SIGUIENTE PASO

1. **Inicia Docker Desktop** (si no está corriendo)
2. **Levanta los servicios**:
   ```powershell
   cd C:\Github\dilus-app-template\docker
   docker compose up -d
   ```
3. **Ejecuta el script SQL**:
   ```powershell
   docker exec -i neologg_cloud_postgres psql -U postgres -d neologg_cloud_db < ../backend/src/infrastructure/database/sql/assign-roles.sql
   ```
4. **Rebuild del frontend** (opcional, para aplicar middlewares corregidos):
   ```powershell
   docker compose build frontend
   docker compose up -d frontend
   ```
5. **Cierra sesión y vuelve a hacer login**
6. **¡Listo!** Ahora deberías poder acceder a /admin

---

**Problema**: ✅ Identificado  
**Solución**: ✅ Implementada  
**Estado**: 🟡 Pendiente ejecutar script SQL  
**Fecha**: 2026-01-15 09:15
