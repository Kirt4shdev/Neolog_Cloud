-- IS USER IN BLACKLIST
DROP FUNCTION IF EXISTS is_user_in_blacklist(UUID) CASCADE;

CREATE OR REPLACE FUNCTION is_user_in_blacklist(_user_id UUID)
RETURNS TABLE (
    "isBlacklisted" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT EXISTS(
        SELECT 1 
        FROM blacklist 
        WHERE blacklist.blocked_id = _user_id
    ) AS "isBlacklisted";
END;
$$ LANGUAGE plpgsql;