-- IS VALID USER ID:
DROP FUNCTION IF EXISTS is_valid_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION is_valid_user_id(
    _userId UUID
)   
RETURNS TABLE (
    "isValid" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT EXISTS(
        SELECT 1 
        FROM users 
        WHERE user_id = _userId
    ) AS "isValid";
END;
$$ LANGUAGE plpgsql;