-- LOG_TRANSMISSION
DROP FUNCTION IF EXISTS log_transmission(VARCHAR, VARCHAR, TEXT, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION log_transmission(
    _serialNumber VARCHAR,
    _topic VARCHAR,
    _payload TEXT,
    _messageType VARCHAR
)
RETURNS TABLE (
    "transmissionId" UUID,
    "deviceId" UUID,
    topic VARCHAR,
    payload TEXT,
    "messageType" VARCHAR,
    "receivedAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _deviceId UUID;
BEGIN
    -- Obtener el device_id del serial number
    SELECT device_id INTO _deviceId
    FROM devices
    WHERE serial_number = _serialNumber;
    
    IF _deviceId IS NULL THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    -- Validar que el messageType sea válido
    IF _messageType NOT IN ('heartbeat', 'data', 'license', 'unknown') THEN
        RAISE EXCEPTION 'Invalid message type. Must be heartbeat, data, license or unknown';
    END IF;
    
    -- Insertar la transmisión
    RETURN QUERY
    INSERT INTO device_transmissions(
        device_id,
        topic,
        payload,
        message_type
    )
    VALUES (
        _deviceId,
        _topic,
        _payload,
        _messageType
    )
    RETURNING 
        transmission_id AS "transmissionId",
        device_id AS "deviceId",
        device_transmissions.topic,
        device_transmissions.payload,
        message_type AS "messageType",
        received_at AS "receivedAt";
END;
$$ LANGUAGE plpgsql;
