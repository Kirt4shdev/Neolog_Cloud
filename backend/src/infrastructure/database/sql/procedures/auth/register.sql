-- REGISTER
DROP FUNCTION IF EXISTS register(VARCHAR, VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION register(
    _name VARCHAR,
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
    INSERT INTO users AS u(name, email, password)
    VALUES (_name, _email, crypt(_userPassword, gen_salt('bf')))
    RETURNING u.user_id AS "userId", u.name, u.email;
END;
$$ LANGUAGE plpgsql;
