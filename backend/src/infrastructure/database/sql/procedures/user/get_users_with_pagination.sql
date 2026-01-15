-- GET USERS WITH PAGINATION:
DROP FUNCTION IF EXISTS get_users_with_pagination(INT, INT) CASCADE;

CREATE OR REPLACE FUNCTION get_users_with_pagination(
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
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
    ORDER BY u.created_at DESC
    LIMIT _limit
    OFFSET _offset;
END;
$$ LANGUAGE plpgsql;    