-- LOG_ACTION
DROP FUNCTION IF EXISTS log_action(UUID, VARCHAR, TEXT, UUID) CASCADE;

CREATE OR REPLACE FUNCTION log_action(
    _deviceId UUID,
    _action VARCHAR,
    _payload TEXT,
    _requestedBy UUID
)
RETURNS TABLE (
    "actionId" UUID,
    "deviceId" UUID,
    action VARCHAR,
    payload TEXT,
    "requestedBy" UUID,
    "requestedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    -- Verificar que el dispositivo existe
    IF NOT EXISTS (SELECT 1 FROM devices WHERE device_id = _deviceId) THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    -- Validar que la acción sea válida
    IF _action NOT IN ('restart', 'sync_time', 'rotate_logs', 'request_status') THEN
        RAISE EXCEPTION 'Invalid action. Must be restart, sync_time, rotate_logs or request_status';
    END IF;
    
    -- Verificar que el admin existe
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _requestedBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can send actions';
    END IF;
    
    -- Insertar la acción
    RETURN QUERY
    INSERT INTO device_actions(
        device_id,
        action,
        payload,
        requested_by
    )
    VALUES (
        _deviceId,
        _action,
        _payload,
        _requestedBy
    )
    RETURNING 
        device_actions.action_id AS "actionId",
        device_actions.device_id AS "deviceId",
        device_actions.action AS action,
        device_actions.payload AS payload,
        device_actions.requested_by AS "requestedBy",
        device_actions.requested_at AS "requestedAt";
END;
$$ LANGUAGE plpgsql;
