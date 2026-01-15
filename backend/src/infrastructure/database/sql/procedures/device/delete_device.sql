-- DELETE_DEVICE
DROP FUNCTION IF EXISTS delete_device(UUID) CASCADE;

CREATE OR REPLACE FUNCTION delete_device(
    _deviceId UUID
)
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    "macAddress" VARCHAR,
    imei VARCHAR,
    status VARCHAR,
    "createdAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _deletedDevice RECORD;
BEGIN
    -- Verificar que el dispositivo existe
    IF NOT EXISTS (SELECT 1 FROM devices WHERE device_id = _deviceId) THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    -- Eliminar el dispositivo y guardar los datos para devolverlos
    DELETE FROM devices
    WHERE device_id = _deviceId
    RETURNING 
        device_id,
        serial_number,
        mac_address,
        devices.imei,
        devices.status,
        created_at
    INTO _deletedDevice;
    
    -- Devolver el dispositivo eliminado
    RETURN QUERY
    SELECT 
        _deletedDevice.device_id AS "deviceId",
        _deletedDevice.serial_number AS "serialNumber",
        _deletedDevice.mac_address AS "macAddress",
        _deletedDevice.imei,
        _deletedDevice.status,
        _deletedDevice.created_at AS "createdAt";
END;
$$ LANGUAGE plpgsql;
