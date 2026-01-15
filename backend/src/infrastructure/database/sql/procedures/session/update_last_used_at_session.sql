-- UPDATE LAST USED AT SESSION:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS update_last_used_at_session CASCADE;

CREATE OR REPLACE FUNCTION update_last_used_at_session(
    _sessionId UUID
)
RETURNS VOID
AS $$
DECLARE
    _rowCount INT;
BEGIN
    -- Actualizar el campo last_used_at de la sesión
    UPDATE sessions
    SET last_used_at = NOW()
    WHERE session_id = _sessionId;

    -- Obtener el número de filas actualizadas
    GET DIAGNOSTICS _rowCount = ROW_COUNT;

    -- Si no se actualizó ninguna fila, lanzar error
    IF _rowCount = 0 THEN
        RAISE EXCEPTION 'Session not found';
    END IF;
END;
$$ LANGUAGE plpgsql;
