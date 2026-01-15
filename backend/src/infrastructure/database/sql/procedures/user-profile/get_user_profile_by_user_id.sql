-- GET USER PROFILE BY USER ID:
DROP FUNCTION IF EXISTS get_user_profile_by_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_user_profile_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "user" JSONB,
    "card" JSONB,
    "roles" TEXT[],
    "sessions" JSONB[],
    "isBlacklisted" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsonb_build_object(
            'userId', u.user_id,
            'name', u.name,
            'email', u.email,
            'createdAt', u.created_at
        ) AS "user",
        CASE 
            WHEN uc.user_card_id IS NOT NULL THEN
                jsonb_build_object(
                    'userCardId', uc.user_card_id,
                    'userId', uc.user_id,
                    'phoneNumber', uc.phone_number,
                    'phonePrefix', uc.phone_prefix,
                    'country', uc.country,
                    'city', uc.city,
                    'address1', uc.address1,
                    'address2', uc.address2,
                    'description', uc.description,
                    'createdAt', uc.created_at,
                    'updatedAt', uc.updated_at
                )
            ELSE NULL
        END AS "card",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS "roles",
        COALESCE(
            ARRAY(
                SELECT jsonb_build_object(
                    'sessionId', s.session_id,
                    'userId', s.user_id,
                    'jwt', s.jwt,
                    'userAgent', s.user_agent,
                    'browser', s.browser,
                    'browserVersion', s.browser_version,
                    'browserMajor', s.browser_major,
                    'os', s.os,
                    'osVersion', s.os_version,
                    'platform', s.platform,
                    'deviceType', s.device_type,
                    'deviceVendor', s.device_vendor,
                    'deviceModel', s.device_model,
                    'device', s.device,
                    'cpuArchitecture', s.cpu_architecture,
                    'engine', s.engine,
                    'engineVersion', s.engine_version,
                    'language', s.language,
                    'languages', s.languages,
                    'ip', s.ip,
                    'isMobile', s.is_mobile,
                    'isTablet', s.is_tablet,
                    'isDesktop', s.is_desktop,
                    'isBot', s.is_bot,
                    'createdAt', s.created_at,
                    'lastUsedAt', s.last_used_at
                )
                FROM sessions s
                WHERE s.user_id = u.user_id
                ORDER BY s.created_at DESC
            ),
            ARRAY[]::JSONB[]
        ) AS "sessions",
        CASE WHEN b.blacklist_id IS NOT NULL THEN TRUE ELSE FALSE END AS "isBlacklisted"
    FROM users u
    LEFT JOIN user_cards uc ON u.user_id = uc.user_id
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    LEFT JOIN blacklist b ON u.user_id = b.blocked_id
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;