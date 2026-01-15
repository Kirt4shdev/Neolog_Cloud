-- GET_PROVISIONING_STATUS
DROP FUNCTION IF EXISTS get_provisioning_status() CASCADE;

CREATE OR REPLACE FUNCTION get_provisioning_status()
RETURNS TABLE (
    "configId" UUID,
    "isEnabled" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "updatedBy" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.config_id AS "configId",
        pc.is_enabled AS "isEnabled",
        pc.created_at AS "createdAt",
        pc.updated_at AS "updatedAt",
        pc.updated_by AS "updatedBy"
    FROM provisioning_config pc
    ORDER BY pc.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
