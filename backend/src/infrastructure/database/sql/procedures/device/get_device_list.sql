-- GET_DEVICE_LIST
DROP FUNCTION IF EXISTS get_device_list() CASCADE;

CREATE OR REPLACE FUNCTION get_device_list()
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    status VARCHAR,
    "lastSeenAt" TIMESTAMPTZ,
    "firmwareVersion" VARCHAR,
    "createdAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.device_id AS "deviceId",
        d.serial_number AS "serialNumber",
        d.status,
        d.last_seen_at AS "lastSeenAt",
        d.firmware_version AS "firmwareVersion",
        d.created_at AS "createdAt"
    FROM devices d
    ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;
