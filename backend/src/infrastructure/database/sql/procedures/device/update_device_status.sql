-- UPDATE_DEVICE_STATUS
-- Actualiza el estado de un dispositivo basado en eventos MQTT (LWT)
DROP FUNCTION IF EXISTS update_device_status(VARCHAR, VARCHAR, TIMESTAMPTZ) CASCADE;

CREATE OR REPLACE FUNCTION update_device_status(
    _serialNumber VARCHAR,
    _status VARCHAR,
    _timestamp TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    status VARCHAR,
    "lastSeenAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _deviceExists BOOLEAN;
BEGIN
    -- Verificar que el dispositivo existe
    SELECT EXISTS(
        SELECT 1 FROM devices WHERE serial_number = _serialNumber
    ) INTO _deviceExists;
    
    IF NOT _deviceExists THEN
        RAISE EXCEPTION 'Device with serial number % not found', _serialNumber;
    END IF;
    
    -- Actualizar el estado y last_seen_at
    UPDATE devices
    SET 
        status = _status,
        last_seen_at = _timestamp,
        updated_at = NOW()
    WHERE serial_number = _serialNumber;
    
    -- Devolver el dispositivo actualizado
    RETURN QUERY
    SELECT 
        d.device_id AS "deviceId",
        d.serial_number AS "serialNumber",
        d.status,
        d.last_seen_at AS "lastSeenAt"
    FROM devices d
    WHERE d.serial_number = _serialNumber;
END;
$$ LANGUAGE plpgsql;
