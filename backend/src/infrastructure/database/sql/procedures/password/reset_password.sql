-- RESET PASSWORD
DROP FUNCTION IF EXISTS reset_password(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION reset_password(_token VARCHAR, _new_password VARCHAR)
RETURNS TABLE (
    email VARCHAR
)
AS $$
DECLARE
    _user_id UUID;
    _user_email VARCHAR;
BEGIN
    -- Buscar el user_id asociado al token
    SELECT password_recovery.user_id INTO _user_id
    FROM password_recovery
    WHERE password_recovery.token = _token;

    -- Si no se encuentra el token, lanzar error
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Invalid token';
    END IF;

    -- Obtener el email del usuario
    SELECT users.email INTO _user_email
    FROM users
    WHERE users.user_id = _user_id;

    -- Actualizar la contraseña del usuario
    UPDATE users
    SET password = crypt(_new_password, gen_salt('bf'))
    WHERE user_id = _user_id;

    -- Eliminar la petición de recuperación de contraseña (hard delete)
    DELETE FROM password_recovery WHERE password_recovery.user_id = _user_id;
    
    -- Retornar el email del usuario
    RETURN QUERY
    SELECT _user_email;
END;
$$ LANGUAGE plpgsql;
