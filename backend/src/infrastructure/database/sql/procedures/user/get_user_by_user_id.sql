-- GET USER BY USER ID:
DROP FUNCTION IF EXISTS get_user_by_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_user_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "userId" UUID,
    "name" VARCHAR,
    "email" VARCHAR,
    "createdAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        u.name,
        u.email,
        u.created_at AS "createdAt"
    FROM users u
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;