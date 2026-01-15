-- ADD USER TO BLACKLIST
DROP FUNCTION IF EXISTS add_user_to_blacklist(UUID, UUID, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION add_user_to_blacklist(
    _blocked_id UUID,
    _blocker_id UUID,
    _reason VARCHAR
)
RETURNS TABLE (
    "blacklistId" UUID,
    "blockerId" UUID,
    "blockedId" UUID,
    reason VARCHAR,
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID
)
AS $$
DECLARE
    _admin_id UUID;
BEGIN
    -- Obtener el admin_id del blocker (solo admins activos)
    SELECT admins.admin_id INTO _admin_id
    FROM admins
    WHERE admins.user_id = _blocker_id AND admins.deleted_at IS NULL;

    -- Si no es admin activo, lanzar error
    IF _admin_id IS NULL THEN
        RAISE EXCEPTION 'Only active admins can add users to blacklist';
    END IF;

    -- Evitar que un usuario se añada a sí mismo a la blacklist
    IF _blocker_id = _blocked_id THEN
        RAISE EXCEPTION 'You cannot add yourself to the blacklist';
    END IF;

    -- Verificar que el usuario bloqueado existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE users.user_id = _blocked_id) THEN
        RAISE EXCEPTION 'Blocked user not found';
    END IF;

    -- Evitar que un admin pueda añadir a otro admin activo a la blacklist
    IF EXISTS (SELECT 1 FROM admins WHERE admins.user_id = _blocked_id AND admins.deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Cannot add an active admin to the blacklist';
    END IF;

    -- Verificar si ya está en la blacklist
    IF EXISTS (SELECT 1 FROM blacklist WHERE blacklist.blocked_id = _blocked_id) THEN
        RAISE EXCEPTION 'User is already in the blacklist'
            USING ERRCODE = '23505';
    END IF;

    -- Insertar en blacklist (blocker_id ahora es admin_id, no user_id)
    RETURN QUERY
    INSERT INTO blacklist (blocker_id, blocked_id, reason, created_by)
    VALUES (_admin_id, _blocked_id, _reason, _admin_id)
    RETURNING 
        blacklist.blacklist_id AS "blacklistId",
        blacklist.blocker_id AS "blockerId",
        blacklist.blocked_id AS "blockedId",
        blacklist.reason,
        blacklist.created_at AS "createdAt",
        blacklist.created_by AS "createdBy";
END;
$$ LANGUAGE plpgsql;