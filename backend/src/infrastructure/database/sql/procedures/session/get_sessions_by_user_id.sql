-- GET SESSIONS BY USER ID:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS get_sessions_by_user_id CASCADE;

CREATE OR REPLACE FUNCTION get_sessions_by_user_id(
    _userId UUID
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
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Devolver todas las sesiones del usuario
    RETURN QUERY
    SELECT 
        s.session_id AS "sessionId",
        s.user_id AS "userId",
        s.jwt,
        s.user_agent AS "userAgent",
        s.browser,
        s.browser_version AS "browserVersion",
        s.browser_major AS "browserMajor",
        s.os,
        s.os_version AS "osVersion",
        s.platform,
        s.device_type AS "deviceType",
        s.device_vendor AS "deviceVendor",
        s.device_model AS "deviceModel",
        s.device,
        s.cpu_architecture AS "cpuArchitecture",
        s.engine,
        s.engine_version AS "engineVersion",
        s.language,
        s.languages,
        s.ip,
        s.is_mobile AS "isMobile",
        s.is_tablet AS "isTablet",
        s.is_desktop AS "isDesktop",
        s.is_bot AS "isBot",
        s.created_at AS "createdAt",
        s.last_used_at AS "lastUsedAt"
    FROM sessions s
    WHERE s.user_id = _userId
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql;
