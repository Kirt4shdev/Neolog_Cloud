-- UPDATE_LAST_SEEN
DROP FUNCTION IF EXISTS update_last_seen(VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION update_last_seen(
    _serialNumber VARCHAR
)
RETURNS VOID
AS $$
BEGIN
    UPDATE devices
    SET last_seen_at = NOW(),
        updated_at = NOW()
    WHERE serial_number = _serialNumber;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;
