-- GET BLACKLISTED USERS
DROP FUNCTION IF EXISTS get_blacklisted_users(INT, INT) CASCADE;

CREATE OR REPLACE FUNCTION get_blacklisted_users(
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
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
BEGIN
    RETURN QUERY
    SELECT 
        blacklist.blacklist_id AS "blacklistId",
        blacklist.blocker_id AS "blockerId",
        blacklist.blocked_id AS "blockedId",
        blacklist.reason,
        blacklist.created_at AS "createdAt",
        blacklist.created_by AS "createdBy"
    FROM 
        blacklist
    ORDER BY 
        blacklist.created_at DESC
    LIMIT 
        _limit
    OFFSET 
        _offset;
END;
$$ LANGUAGE plpgsql;