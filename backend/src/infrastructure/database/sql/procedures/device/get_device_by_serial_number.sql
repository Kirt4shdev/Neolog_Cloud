-- GET_DEVICE_BY_SERIAL_NUMBER
DROP FUNCTION IF EXISTS get_device_by_serial_number(VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION get_device_by_serial_number(
    _serialNumber VARCHAR
)
RETURNS TABLE (
    "deviceId" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT device_id AS "deviceId"
    FROM devices
    WHERE serial_number = _serialNumber;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;
