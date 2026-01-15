-- REMOVE ROLE (SOFT DELETE):
DROP FUNCTION IF EXISTS remove_role(UUID, UUID, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION remove_role(
    _userId UUID,
    _deletedBy UUID,
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

    -- Verificar que el deletedBy es un admin activo
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _deletedBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can remove roles';
    END IF;

    -- Soft delete del rol correspondiente
    IF _role = 'admin' THEN
        -- Verificar si tiene el rol activo
        IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User does not have admin role';
        END IF;

        -- Verificar que un admin no se quite el rol a sí mismo
        IF EXISTS (SELECT 1 FROM admins WHERE admin_id = _deletedBy AND user_id = _userId) THEN
            RAISE EXCEPTION 'Admins cannot remove their own admin role';
        END IF;

        -- Soft delete del admin
        UPDATE admins 
        SET deleted_at = NOW(), deleted_by = _deletedBy
        WHERE user_id = _userId AND deleted_at IS NULL;

    ELSIF _role = 'client' THEN
        -- Verificar si tiene el rol activo
        IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User does not have client role';
        END IF;

        -- Soft delete del client
        UPDATE clients 
        SET deleted_at = NOW(), deleted_by = _deletedBy
        WHERE user_id = _userId AND deleted_at IS NULL;
    END IF;

    -- Devolver el estado actual de los roles del usuario (roles activos restantes)
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS roles,
        COALESCE(a.created_at, c.created_at) AS "createdAt",
        COALESCE(a.created_by, c.created_by) AS "createdBy",
        NULL::TIMESTAMPTZ AS "deletedAt",
        NULL::UUID AS "deletedBy"
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.user_id
    LEFT JOIN clients c ON u.user_id = c.user_id
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;