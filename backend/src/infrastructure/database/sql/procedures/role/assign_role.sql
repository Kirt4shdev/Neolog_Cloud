-- ASSIGN ROLE:
DROP FUNCTION IF EXISTS assign_role(UUID, UUID, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION assign_role(
    _userId UUID,
    _createdBy UUID,
    _role VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    roles TEXT[],
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Verificar que el rol es válido
    IF _role NOT IN ('admin', 'client') THEN
        RAISE EXCEPTION 'Invalid role. Must be admin or client';
    END IF;

    -- Verificar que el creador es un admin activo
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _createdBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can assign roles';
    END IF;

    -- Asignar el rol correspondiente
    IF _role = 'admin' THEN
        -- Verificar si ya tiene el rol activo
        IF EXISTS (SELECT 1 FROM admins WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User already has admin role';
        END IF;

        -- Siempre insertar nuevo registro para mantener historial completo
        INSERT INTO admins(user_id, created_by)
        VALUES (_userId, _createdBy);

    ELSIF _role = 'client' THEN
        -- Verificar si ya tiene el rol activo
        IF EXISTS (SELECT 1 FROM clients WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User already has client role';
        END IF;

        -- Siempre insertar nuevo registro para mantener historial completo
        INSERT INTO clients(user_id, created_by)
        VALUES (_userId, _createdBy);
    END IF;

    -- Devolver el estado actual de los roles del usuario (solo activos)
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS roles,
        COALESCE(a.created_at, c.created_at) AS "createdAt",
        CASE WHEN _role = 'admin' THEN a.created_by ELSE c.created_by END AS "createdBy",
        NULL::TIMESTAMPTZ AS "deletedAt",
        NULL::UUID AS "deletedBy"
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;