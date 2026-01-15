-- DELETE ALL USER SESSIONS:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS delete_all_user_sessions CASCADE;

CREATE OR REPLACE FUNCTION delete_all_user_sessions(
    _userId UUID
)
RETURNS VOID
AS $$
DECLARE
    _deletedCount INT;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Eliminar todas las sesiones del usuario
    DELETE FROM sessions
    WHERE user_id = _userId;

    -- Obtener el número de sesiones eliminadas
    GET DIAGNOSTICS _deletedCount = ROW_COUNT;

    -- Si no se eliminó ninguna sesión, lanzar error
    IF _deletedCount = 0 THEN
        RAISE EXCEPTION 'No sessions found for this user';
    END IF;
END;
$$ LANGUAGE plpgsql;
