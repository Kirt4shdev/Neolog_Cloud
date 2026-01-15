/**
 * ICacheService - Interfaz para servicios de caché
 * Abstracción que permite desacoplar la lógica de negocio de la implementación técnica (Redis, Memcached, etc.)
 */
export interface ICacheService {
  /**
   * Obtiene un valor de un conjunto (SET)
   */
  getValueFromSet(key: string): Promise<Record<string, any> | null>;

  /**
   * Agrega un valor a un conjunto (SET)
   */
  addValueToSet(object: { key: string; value: string | number }): Promise<void>;

  /**
   * Elimina un valor de un conjunto (SET)
   */
  removeValueFromSet(object: { key: string; value: string }): Promise<void>;

  /**
   * Elimina una clave completa
   */
  removeKey(key: string): Promise<void>;

  /**
   * Verifica si un valor existe en una clave (SET)
   */
  isValueInKey(object: {
    key: string;
    value: string | number;
  }): Promise<boolean>;

  /**
   * Verifica si una clave existe
   */
  isKeyExists(key: string): Promise<boolean>;

  /**
   * Incrementa un contador y establece expiración si es la primera vez
   */
  incrementWithExpire(key: string, expireSeconds: number): Promise<number>;

  /**
   * Establece una clave con valor y expiración
   */
  setKeyWithExpire(
    key: string,
    value: string,
    expireSeconds: number
  ): Promise<void>;

  /**
   * Obtiene un valor de una clave con expiración
   */
  getKeyWithExpire(key: string): Promise<Record<string, any> | null>;
}
