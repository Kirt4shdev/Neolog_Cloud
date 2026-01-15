-- EMIT EVENT
DROP FUNCTION IF EXISTS emit_event(
    _action VARCHAR,
    _endpoint VARCHAR,
    _occurredAt TIMESTAMPTZ,
    _requiredRole VARCHAR,
    _isSuccessful BOOLEAN,
    _failureReason VARCHAR,
    _location VARCHAR,
    _ip VARCHAR,
    _tableName VARCHAR,
    _userId UUID,
    _resourceId UUID,
    _metadata JSONB,
    _method VARCHAR,
    _isExploit BOOLEAN
) CASCADE;

CREATE OR REPLACE FUNCTION emit_event(
    _action VARCHAR,
    _endpoint VARCHAR,
    _occurredAt TIMESTAMPTZ,
    _requiredRole VARCHAR,
    _isSuccessful BOOLEAN,
    _failureReason VARCHAR,
    _location VARCHAR,
    _ip VARCHAR,
    _tableName VARCHAR,
    _userId UUID,
    _resourceId UUID,
    _metadata JSONB,
    _method VARCHAR,
    _isExploit BOOLEAN
) RETURNS VOID
AS $$
BEGIN
    INSERT INTO events (
        action,
        endpoint,
        occurred_at,
        required_role,
        is_successful,
        failure_reason,
        location,
        ip,
        table_name,
        user_id,
        resource_id,
        metadata,
        method,
        is_exploit
    ) VALUES (
        _action,
        _endpoint,
        _occurredAt,
        _requiredRole,
        _isSuccessful,
        _failureReason,
        _location,
        _ip,
        _tableName,
        _userId,
        _resourceId,
        _metadata,
        _method::METHOD_TYPE,
        _isExploit
    );
END;
$$ LANGUAGE plpgsql;