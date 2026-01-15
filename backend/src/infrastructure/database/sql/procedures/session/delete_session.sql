-- DELETE SESSION:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS delete_session CASCADE;

CREATE OR REPLACE FUNCTION delete_session(
    _sessionId UUID
)
RETURNS TABLE (
    "sessionId" UUID,
    "userId" UUID,
    jwt VARCHAR,
    "userAgent" TEXT,
    browser VARCHAR,
    "browserVersion" VARCHAR,
    "browserMajor" VARCHAR,
    os VARCHAR,
    "osVersion" VARCHAR,
    platform VARCHAR,
    "deviceType" VARCHAR,
    "deviceVendor" VARCHAR,
    "deviceModel" VARCHAR,
    device VARCHAR,
    "cpuArchitecture" VARCHAR,
    engine VARCHAR,
    "engineVersion" VARCHAR,
    language VARCHAR,
    languages VARCHAR,
    ip VARCHAR,
    "isMobile" BOOLEAN,
    "isTablet" BOOLEAN,
    "isDesktop" BOOLEAN,
    "isBot" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "lastUsedAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _deletedSession RECORD;
BEGIN
    -- Eliminar la sesión y guardar los datos
    DELETE FROM sessions s
    WHERE s.session_id = _sessionId
    RETURNING 
        s.session_id,
        s.user_id,
        s.jwt,
        s.user_agent,
        s.browser,
        s.browser_version,
        s.browser_major,
        s.os,
        s.os_version,
        s.platform,
        s.device_type,
        s.device_vendor,
        s.device_model,
        s.device,
        s.cpu_architecture,
        s.engine,
        s.engine_version,
        s.language,
        s.languages,
        s.ip,
        s.is_mobile,
        s.is_tablet,
        s.is_desktop,
        s.is_bot,
        s.created_at,
        s.last_used_at
    INTO _deletedSession;

    -- Si no se encontró la sesión, lanzar error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    -- Devolver la sesión eliminada
    RETURN QUERY
    SELECT 
        _deletedSession.session_id AS "sessionId",
        _deletedSession.user_id AS "userId",
        _deletedSession.jwt,
        _deletedSession.user_agent AS "userAgent",
        _deletedSession.browser,
        _deletedSession.browser_version AS "browserVersion",
        _deletedSession.browser_major AS "browserMajor",
        _deletedSession.os,
        _deletedSession.os_version AS "osVersion",
        _deletedSession.platform,
        _deletedSession.device_type AS "deviceType",
        _deletedSession.device_vendor AS "deviceVendor",
        _deletedSession.device_model AS "deviceModel",
        _deletedSession.device,
        _deletedSession.cpu_architecture AS "cpuArchitecture",
        _deletedSession.engine,
        _deletedSession.engine_version AS "engineVersion",
        _deletedSession.language,
        _deletedSession.languages,
        _deletedSession.ip,
        _deletedSession.is_mobile AS "isMobile",
        _deletedSession.is_tablet AS "isTablet",
        _deletedSession.is_desktop AS "isDesktop",
        _deletedSession.is_bot AS "isBot",
        _deletedSession.created_at AS "createdAt",
        _deletedSession.last_used_at AS "lastUsedAt";
END;
$$ LANGUAGE plpgsql;
