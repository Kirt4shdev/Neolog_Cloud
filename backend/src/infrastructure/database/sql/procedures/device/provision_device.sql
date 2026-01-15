-- PROVISION_DEVICE
DROP FUNCTION IF EXISTS provision_device(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION provision_device(
    _serialNumber VARCHAR,
    _macAddress VARCHAR,
    _imei VARCHAR,
    _license VARCHAR,
    _rootPassword VARCHAR,
    _mqttUsername VARCHAR,
    _mqttPassword VARCHAR
)
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    license VARCHAR,
    "rootPassword" VARCHAR,
    "mqttUsername" VARCHAR,
    "mqttPassword" VARCHAR
)
AS $$
BEGIN
    -- Verificar que no exista un dispositivo con el mismo serial number
    IF EXISTS (SELECT 1 FROM devices WHERE serial_number = _serialNumber) THEN
        RAISE EXCEPTION 'Device with this serial number already exists';
    END IF;

    -- Insertar el nuevo dispositivo
    RETURN QUERY
    INSERT INTO devices(
        serial_number,
        mac_address,
        imei,
        license,
        root_password,
        mqtt_username,
        mqtt_password,
        status
    )
    VALUES (
        _serialNumber,
        _macAddress,
        _imei,
        _license,
        _rootPassword,
        _mqttUsername,
        _mqttPassword,
        'unknown'
    )
    RETURNING 
        device_id AS "deviceId",
        serial_number AS "serialNumber",
        devices.license,
        root_password AS "rootPassword",
        mqtt_username AS "mqttUsername",
        mqtt_password AS "mqttPassword";
END;
$$ LANGUAGE plpgsql;
