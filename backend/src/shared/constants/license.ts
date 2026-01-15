/**
 * Constantes para generación de licencias y credenciales Neologg
 */
export const LICENSE = {
  // Componentes de la licencia
  SALT_PREFIX: "NEOLOGG",
  SALT_SUFFIX: "93",

  // Componentes del password root
  ROOT_PASSWORD_PREFIX: "NEOLOGG",
  ROOT_PASSWORD_SUFFIX: "TOPO",

  // Componentes del password MQTT
  MQTT_PASSWORD_PREFIX: "NEOLOGG",
  MQTT_PASSWORD_SUFFIX: "TOPO",

  // Algoritmo
  HASH_ALGORITHM: "sha256" as const,
  HASH_ENCODING: "hex" as const,
} as const;

/**
 * Fórmulas de generación
 *
 * Licencia:
 * SHA-256(SN + MAC + "NEOLOGG" + IMEI + "93")
 *
 * Password root:
 * "NEOLOGG" + SN + "TOPO"
 *
 * Password MQTT:
 * "NEOLOGG" + SN + "TOPO" + IMEI
 *
 * Usuario MQTT:
 * SN
 */
