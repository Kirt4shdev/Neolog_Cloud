-- Script para asignar roles a usuarios existentes
-- Este script asigna el rol de admin al usuario superadmin@neologg.com

-- 1. Obtener el user_id del superadmin
DO $$
DECLARE
    v_user_id UUID;
    v_admin_id UUID;
BEGIN
    -- Buscar el user_id de superadmin@neologg.com
    SELECT user_id INTO v_user_id
    FROM users
    WHERE email = 'superadmin@neologg.com';

    -- Si el usuario existe
    IF v_user_id IS NOT NULL THEN
        -- Verificar si ya es admin
        IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = v_user_id) THEN
            -- Obtener el admin_id del admin por defecto (quien creará este admin)
            SELECT admin_id INTO v_admin_id
            FROM admins
            WHERE user_id = '122b71f0-24af-4f24-a8e9-658e4284a5ef'
            LIMIT 1;

            -- Insertar en la tabla admins
            INSERT INTO admins(user_id, created_by)
            VALUES (v_user_id, v_admin_id);

            RAISE NOTICE 'Admin role assigned to superadmin@neologg.com';
        ELSE
            RAISE NOTICE 'User superadmin@neologg.com already has admin role';
        END IF;
    ELSE
        RAISE NOTICE 'User superadmin@neologg.com not found';
    END IF;

    -- Hacer lo mismo para test@test.com (asignar rol client)
    SELECT user_id INTO v_user_id
    FROM users
    WHERE email = 'test@test.com';

    IF v_user_id IS NOT NULL THEN
        -- Verificar si ya es client
        IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = v_user_id) THEN
            -- Insertar en la tabla clients
            INSERT INTO clients(user_id, created_by)
            VALUES (v_user_id, v_admin_id);

            RAISE NOTICE 'Client role assigned to test@test.com';
        ELSE
            RAISE NOTICE 'User test@test.com already has client role';
        END IF;
    ELSE
        RAISE NOTICE 'User test@test.com not found';
    END IF;
END $$;

-- Verificar los roles asignados
SELECT 
    u.email,
    CASE 
        WHEN a.user_id IS NOT NULL THEN 'admin'
        WHEN c.user_id IS NOT NULL THEN 'client'
        ELSE 'no role'
    END as role
FROM users u
LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
WHERE u.email IN ('superadmin@neologg.com', 'test@test.com', 'admin@email.com')
ORDER BY u.email;
