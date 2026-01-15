-- LOGIN
DROP FUNCTION IF EXISTS login(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION login(
    _email VARCHAR,
    _userPassword VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    name VARCHAR,
    email VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id AS "userId", u.name, u.email
    FROM users u
    WHERE u.email = _email
      AND u.password = crypt(_userPassword, u.password);
END;
$$ LANGUAGE plpgsql;