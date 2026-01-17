/**
 * Constantes para MQTT Neologg
 */
export const MQTT = {
  // Topics
  TOPIC_PREFIX: "production/neologg",
  TOPIC_HEARTBEAT: "heartbeat",
  TOPIC_DATA: "data",
  TOPIC_LICENSE: "license",
  TOPIC_INFO: "info",
  TOPIC_ACTIONS: "actions",

  // QoS levels
  QOS_0: 0, // At most once
  QOS_1: 1, // At least once
  QOS_2: 2, // Exactly once

  // Admin credentials (for backend connection)
  ADMIN_USERNAME: "neologg",
  ADMIN_PASSWORD: "neologg93",

  // Connection settings
  CONNECT_TIMEOUT: 30000, // 30 seconds
  RECONNECT_PERIOD: 5000, // 5 seconds
  KEEPALIVE: 60, // 60 seconds
} as const;

/**
 * Helper para construir topics MQTT
 */
export const MqttTopics = {
  /**
   * Topic de heartbeat para un dispositivo
   * Formato: production/neologg/{SN}/heartbeat
   */
  heartbeat: (serialNumber: string) =>
    `${MQTT.TOPIC_PREFIX}/${serialNumber}/${MQTT.TOPIC_HEARTBEAT}`,

  /**
   * Topic de datos para un dispositivo
   * Formato: production/neologg/{SN}/data
   */
  data: (serialNumber: string) =>
    `${MQTT.TOPIC_PREFIX}/${serialNumber}/${MQTT.TOPIC_DATA}`,

  /**
   * Topic de licencia para un dispositivo
   * Formato: production/neologg/{SN}/license
   */
  license: (serialNumber: string) =>
    `${MQTT.TOPIC_PREFIX}/${serialNumber}/${MQTT.TOPIC_LICENSE}`,

  /**
   * Topic de información de hardware/firmware
   * Formato: production/neologg/{SN}/info
   */
  info: (serialNumber: string) =>
    `${MQTT.TOPIC_PREFIX}/${serialNumber}/${MQTT.TOPIC_INFO}`,

  /**
   * Topic de acción específica para un dispositivo
   * Formato: production/neologg/{SN}/actions/{action}
   * Ejemplos:
   * - production/neologg/NL8-2512014/actions/restart
   * - production/neologg/NL8-2512014/actions/sync_time
   */
  action: (serialNumber: string, action: string) =>
    `${MQTT.TOPIC_PREFIX}/${serialNumber}/${MQTT.TOPIC_ACTIONS}/${action}`,

  /**
   * Pattern para suscribirse a todos los topics de todos los dispositivos
   * Formato: production/neologg/#
   */
  all: () => `${MQTT.TOPIC_PREFIX}/#`,

  /**
   * Pattern para suscribirse a todos los topics de un dispositivo específico
   * Formato: production/neologg/{SN}/#
   */
  device: (serialNumber: string) => `${MQTT.TOPIC_PREFIX}/${serialNumber}/#`,
};
