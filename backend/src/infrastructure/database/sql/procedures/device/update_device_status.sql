-- UPDATE_DEVICE_STATUS
DROP FUNCTION IF EXISTS update_device_status(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION update_device_status(
    _serialNumber VARCHAR,
    _status VARCHAR
)
RETURNS VOID
AS $$
BEGIN
    -- Validar que el status sea válido
    IF _status NOT IN ('online', 'offline', 'unknown') THEN
        RAISE EXCEPTION 'Invalid status. Must be online, offline or unknown';
    END IF;
    
    UPDATE devices
    SET status = _status,
        updated_at = NOW()
    WHERE serial_number = _serialNumber;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;
