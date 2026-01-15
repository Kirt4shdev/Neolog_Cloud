-- FORGOT PASSWORD
DROP FUNCTION IF EXISTS forgot_password(VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION forgot_password(_email VARCHAR)
RETURNS TABLE (
    email VARCHAR,
    token VARCHAR
)
AS $$
DECLARE
    _user_id UUID;
    _token VARCHAR;
BEGIN
    -- Buscar el usuario por email
    SELECT users.user_id INTO _user_id
    FROM users
    WHERE users.email = _email;

    -- Si no se encuentra el usuario, lanzar error
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Email not found';
    END IF;

    -- Verificar si ya existe una petición de recuperación de contraseña activa
    IF EXISTS (SELECT 1 FROM password_recovery WHERE password_recovery.user_id = _user_id) THEN
        RAISE EXCEPTION 'There is already a password recovery request for this user'
            USING ERRCODE = '23505';
    END IF;

    -- Generar token aleatorio (120 caracteres)
    _token := encode(gen_random_bytes(90), 'hex');

    -- Insertar la petición de recuperación de contraseña y devolver email y token
    INSERT INTO password_recovery (user_id, token)
    VALUES (_user_id, _token);
    
    -- Retornar el email y el token generado
    RETURN QUERY
    SELECT _email, _token;
END;
$$ LANGUAGE plpgsql;