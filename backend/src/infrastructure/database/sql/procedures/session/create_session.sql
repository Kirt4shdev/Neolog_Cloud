-- CREATE SESSION:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS create_session CASCADE;

CREATE OR REPLACE FUNCTION create_session(
    _userId UUID,
    _jwt VARCHAR,
    _userAgent TEXT,
    _browser VARCHAR,
    _browserVersion VARCHAR,
    _browserMajor VARCHAR,
    _os VARCHAR,
    _osVersion VARCHAR,
    _platform VARCHAR,
    _deviceType VARCHAR,
    _deviceVendor VARCHAR,
    _deviceModel VARCHAR,
    _device VARCHAR,
    _cpuArchitecture VARCHAR,
    _engine VARCHAR,
    _engineVersion VARCHAR,
    _language VARCHAR,
    _languages VARCHAR,
    _ip VARCHAR,
    _isMobile BOOLEAN,
    _isTablet BOOLEAN,
    _isDesktop BOOLEAN,
    _isBot BOOLEAN
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
    _sessionId UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Validar deviceType
    IF _deviceType NOT IN ('mobile', 'tablet', 'desktop', 'smarttv', 'wearable', 'console') THEN
        RAISE EXCEPTION 'Invalid device type';
    END IF;

    -- Insertar la nueva sesión
    INSERT INTO sessions(
        user_id,
        jwt,
        user_agent,
        browser,
        browser_version,
        browser_major,
        os,
        os_version,
        platform,
        device_type,
        device_vendor,
        device_model,
        device,
        cpu_architecture,
        engine,
        engine_version,
        language,
        languages,
        ip,
        is_mobile,
        is_tablet,
        is_desktop,
        is_bot,
        last_used_at
    )
    VALUES (
        _userId,
        _jwt,
        _userAgent,
        _browser,
        _browserVersion,
        _browserMajor,
        _os,
        _osVersion,
        _platform,
        _deviceType,
        _deviceVendor,
        _deviceModel,
        _device,
        _cpuArchitecture,
        _engine,
        _engineVersion,
        _language,
        _languages,
        _ip,
        _isMobile,
        _isTablet,
        _isDesktop,
        _isBot,
        NOW()
    )
    RETURNING session_id INTO _sessionId;

    -- Devolver la sesión creada
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
    WHERE s.session_id = _sessionId;
END;
$$ LANGUAGE plpgsql;
