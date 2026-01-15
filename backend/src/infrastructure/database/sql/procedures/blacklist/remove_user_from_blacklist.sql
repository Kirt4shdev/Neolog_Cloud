-- REMOVE USER FROM BLACKLIST (HARD DELETE)
DROP FUNCTION IF EXISTS remove_user_from_blacklist(UUID, UUID) CASCADE;

CREATE OR REPLACE FUNCTION remove_user_from_blacklist(
    _blocked_id UUID,
    _remover_id UUID
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
    _result RECORD;
BEGIN
    -- Obtener el admin_id del remover (solo admins activos)
    SELECT admins.admin_id INTO _admin_id
    FROM admins
    WHERE admins.user_id = _remover_id AND admins.deleted_at IS NULL;

    -- Si no es admin activo, lanzar error
    IF _admin_id IS NULL THEN
        RAISE EXCEPTION 'Only active admins can remove users from blacklist';
    END IF;

    -- Evitar que un usuario se elimine a sí mismo de la blacklist
    IF _remover_id = _blocked_id THEN
        RAISE EXCEPTION 'You cannot remove yourself from the blacklist';
    END IF;

    -- Verificar si el usuario está en la blacklist y obtener el registro antes de eliminarlo
    SELECT 
        blacklist.blacklist_id,
        blacklist.blocker_id,
        blacklist.blocked_id,
        blacklist.reason,
        blacklist.created_at,
        blacklist.created_by
    INTO _result
    FROM blacklist
    WHERE blacklist.blocked_id = _blocked_id;

    -- Si no existe, lanzar error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User is not in the blacklist';
    END IF;

    -- Hard delete (eliminar registro)
    DELETE FROM blacklist
    WHERE blacklist.blocked_id = _blocked_id;

    -- Retornar el registro que fue eliminado
    RETURN QUERY
    SELECT 
        _result.blacklist_id AS "blacklistId",
        _result.blocker_id AS "blockerId",
        _result.blocked_id AS "blockedId",
        _result.reason,
        _result.created_at AS "createdAt",
        _result.created_by AS "createdBy";
END;
$$ LANGUAGE plpgsql;