/**
 * Constantes para dispositivos Neologg
 */
export const DEVICE = {
  // Serial Number
  SN_MIN_LENGTH: 5,
  SN_MAX_LENGTH: 50,

  // MAC Address
  MAC_MIN_LENGTH: 12,
  MAC_MAX_LENGTH: 17, // Con separadores: AA:BB:CC:DD:EE:FF

  // IMEI
  IMEI_MIN_LENGTH: 15,
  IMEI_MAX_LENGTH: 15,

  // License
  LICENSE_LENGTH: 64, // SHA-256 produces 64 hex characters

  // MQTT Password
  MQTT_PASSWORD_MIN_LENGTH: 20,
  MQTT_PASSWORD_MAX_LENGTH: 100,

  // Root Password
  ROOT_PASSWORD_MIN_LENGTH: 15,
  ROOT_PASSWORD_MAX_LENGTH: 50,

  // Status
  STATUSES: ["online", "offline", "unknown"] as const,

  // Online threshold (milliseconds)
  ONLINE_THRESHOLD_MS: 120000, // 2 minutes (2x 60s heartbeat interval)

  // Actions
  ACTIONS: ["restart", "sync_time", "rotate_logs", "request_status"] as const,
} as const;
