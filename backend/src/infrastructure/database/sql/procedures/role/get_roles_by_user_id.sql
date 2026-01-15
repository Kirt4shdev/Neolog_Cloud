-- GET ROLES BY USER ID:
DROP FUNCTION IF EXISTS get_roles_by_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_roles_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "userId" UUID,
    "adminId" UUID,
    "clientId" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        a.admin_id AS "adminId",
        c.client_id AS "clientId"
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;