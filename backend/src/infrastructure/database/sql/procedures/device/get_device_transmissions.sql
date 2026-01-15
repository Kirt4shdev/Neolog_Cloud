-- GET_DEVICE_TRANSMISSIONS
DROP FUNCTION IF EXISTS get_device_transmissions(UUID, INTEGER) CASCADE;

CREATE OR REPLACE FUNCTION get_device_transmissions(
    _deviceId UUID,
    _limit INTEGER DEFAULT 50
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
BEGIN
    -- Verificar que el dispositivo existe
    IF NOT EXISTS (SELECT 1 FROM devices WHERE device_id = _deviceId) THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    RETURN QUERY
    SELECT 
        dt.transmission_id AS "transmissionId",
        dt.device_id AS "deviceId",
        dt.topic,
        dt.payload,
        dt.message_type AS "messageType",
        dt.received_at AS "receivedAt"
    FROM device_transmissions dt
    WHERE dt.device_id = _deviceId
    ORDER BY dt.received_at DESC
    LIMIT _limit;
END;
$$ LANGUAGE plpgsql;
