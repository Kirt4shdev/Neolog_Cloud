/**
 * Constantes de configuración para Valkey (Redis)
 *
 * IMPORTANTE: Valkey debe estar corriendo en Docker
 * Para iniciar: docker compose up -d valkey
 */
export const REDIS_SERVER = {
  BAN_TIME_SECONDS: 600, // 10 minutos de ban
  WINDOW_SECONDS: 60, // Ventana de 1 minuto
  MAX_REQUESTS: 100, // 100 requests máximo en la ventana
  USER_CACHE_TIME: 60, // 1 minuto de caché
} as const;
