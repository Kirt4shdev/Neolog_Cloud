import crypto from "crypto";
import { LICENSE } from "@shared/constants/license";

/**
 * LicenseGenerator - Genera licencias y credenciales para dispositivos Neologg
 * TODAS las credenciales son SHA-256
 */
export class LicenseGenerator {
  /**
   * Genera la licencia del dispositivo
   * Fórmula: SHA-256(SN + MAC + "NEOLOGG" + IMEI + "93")
   */
  public static generateLicense(
    serialNumber: string,
    macAddress: string,
    imei: string
  ): string {
    const input =
      serialNumber +
      macAddress +
      LICENSE.SALT_PREFIX +
      imei +
      LICENSE.SALT_SUFFIX;

    return crypto
      .createHash(LICENSE.HASH_ALGORITHM)
      .update(input)
      .digest(LICENSE.HASH_ENCODING);
  }

  /**
   * Genera el password root del dispositivo
   * Fórmula: SHA-256("NEOLOGG" + SN + "TOPO")
   */
  public static generateRootPassword(serialNumber: string): string {
    const input =
      LICENSE.ROOT_PASSWORD_PREFIX +
      serialNumber +
      LICENSE.ROOT_PASSWORD_SUFFIX;

    return crypto
      .createHash(LICENSE.HASH_ALGORITHM)
      .update(input)
      .digest(LICENSE.HASH_ENCODING);
  }

  /**
   * Genera el username MQTT del dispositivo
   * Fórmula: SN (sin hash)
   */
  public static generateMqttUsername(serialNumber: string): string {
    return serialNumber;
  }

  /**
   * Genera el password MQTT del dispositivo
   * Fórmula: SHA-256("NEOLOGG" + SN + "TOPO" + IMEI)
   */
  public static generateMqttPassword(
    serialNumber: string,
    imei: string
  ): string {
    const input =
      LICENSE.MQTT_PASSWORD_PREFIX +
      serialNumber +
      LICENSE.MQTT_PASSWORD_SUFFIX +
      imei;

    return crypto
      .createHash(LICENSE.HASH_ALGORITHM)
      .update(input)
      .digest(LICENSE.HASH_ENCODING);
  }
}
