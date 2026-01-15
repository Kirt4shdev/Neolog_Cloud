-- TOGGLE_PROVISIONING
DROP FUNCTION IF EXISTS toggle_provisioning(BOOLEAN, UUID) CASCADE;

CREATE OR REPLACE FUNCTION toggle_provisioning(
    _isEnabled BOOLEAN,
    _updatedBy UUID
)
RETURNS TABLE (
    "configId" UUID,
    "isEnabled" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "updatedBy" UUID
)
AS $$
DECLARE
    _configId UUID;
BEGIN
    -- Verificar que el admin existe
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _updatedBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can toggle provisioning';
    END IF;
    
    -- Obtener el config_id actual
    SELECT config_id INTO _configId
    FROM provisioning_config
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Actualizar la configuración
    UPDATE provisioning_config
    SET is_enabled = _isEnabled,
        updated_at = NOW(),
        updated_by = _updatedBy
    WHERE config_id = _configId;
    
    -- Devolver la configuración actualizada
    RETURN QUERY
    SELECT 
        pc.config_id AS "configId",
        pc.is_enabled AS "isEnabled",
        pc.created_at AS "createdAt",
        pc.updated_at AS "updatedAt",
        pc.updated_by AS "updatedBy"
    FROM provisioning_config pc
    WHERE pc.config_id = _configId;
END;
$$ LANGUAGE plpgsql;
