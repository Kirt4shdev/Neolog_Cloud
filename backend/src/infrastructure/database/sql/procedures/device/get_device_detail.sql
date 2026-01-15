-- GET_DEVICE_DETAIL
DROP FUNCTION IF EXISTS get_device_detail(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_device_detail(
    _deviceId UUID
)
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    "macAddress" VARCHAR,
    imei VARCHAR,
    license VARCHAR,
    "rootPassword" VARCHAR,
    "mqttUsername" VARCHAR,
    "mqttPassword" VARCHAR,
    status VARCHAR,
    "lastSeenAt" TIMESTAMPTZ,
    "firmwareVersion" VARCHAR,
    "hardwareVersion" VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    "locationUpdatedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.device_id AS "deviceId",
        d.serial_number AS "serialNumber",
        d.mac_address AS "macAddress",
        d.imei,
        d.license,
        d.root_password AS "rootPassword",
        d.mqtt_username AS "mqttUsername",
        d.mqtt_password AS "mqttPassword",
        d.status,
        d.last_seen_at AS "lastSeenAt",
        d.firmware_version AS "firmwareVersion",
        d.hardware_version AS "hardwareVersion",
        d.latitude,
        d.longitude,
        d.location_updated_at AS "locationUpdatedAt",
        d.created_at AS "createdAt",
        d.updated_at AS "updatedAt"
    FROM devices d
    WHERE d.device_id = _deviceId;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;
