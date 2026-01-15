import Redis from "ioredis";
import { envs } from "@shared/envs";
import { Debug } from "@shared/utils/Debug";
import type { ICacheService } from "@core/shared/services/ICacheService";

class RedisServer implements ICacheService {
  #redis: Redis | undefined;

  constructor(private readonly _config: RedisServerConnectionConfig) {}

  /**
   * Inicializa la conexión a Valkey (Redis)
   * Se conecta al contenedor Docker definido en docker-compose.yml
   * @throws {Error} Si no se puede establecer la conexión
   */
  public async init(): Promise<void> {
    if (!this.#redis) {
      throw new Error("Redis connection not initialized. Call config() first.");
    }

    return new Promise((resolve, reject) => {
      // Timeout de conexión
      const timeout = setTimeout(() => {
        reject(
          new Error(
            "Valkey connection timeout. Is the Docker container running? Run: docker compose up -d"
          )
        );
      }, 5000);

      this.#redis!.ping()
        .then(() => {
          clearTimeout(timeout);
          Debug.success("Valkey connection established");
          resolve();
        })
        .catch((error) => {
          clearTimeout(timeout);
          Debug.error(`Error connecting to Valkey: ${error.message}`);
          Debug.warning(
            "Make sure Valkey is running: docker compose up -d valkey"
          );
          reject(
            new Error(
              `Valkey connection failed: ${error.message}. Is the Docker container running?`
            )
          );
        });
    });
  }

  public config(): this {
    const redis = new Redis(this._config);

    // Handler de errores para evitar crashes
    redis.on("error", (err: any) => {
      Debug.error("Valkey connection error:");
      Debug.error(`Code: ${err.code || "UNKNOWN"}`);
      Debug.error(`Message: ${err.message}`);
    });

    // Handler de reconexión
    redis.on("reconnecting", () => {
      Debug.warning("Attempting to reconnect to Valkey...");
    });

    // Handler de conexión exitosa
    redis.on("connect", () => {
      Debug.success("Connected to Valkey");
    });

    // Handler de cierre
    redis.on("close", () => {
      Debug.info("Valkey connection closed");
    });

    this.#redis = redis;
    return this;
  }

  public async getValueFromSet(
    key: string
  ): Promise<Record<string, any> | null> {
    if (!this.#redis) throw new Error("Redis connection not initialized");

    const values = await this.#redis.smembers(key);
    return values.length > 0 ? JSON.parse(values[0]) : null;
  }

  public async addValueToSet(object: {
    key: string;
    value: string | number;
  }): Promise<void> {
    if (!this.#redis) {
      throw new Error("Redis connection not initialized");
    }

    await this.#redis.sadd(object.key, object.value);
  }

  public async removeValueFromSet(object: {
    key: string;
    value: string;
  }): Promise<void> {
    if (!this.#redis) {
      throw new Error("Redis connection not initialized");
    }

    await this.#redis.srem(object.key, object.value);
  }

  public async removeKey(key: string): Promise<void> {
    if (!this.#redis) {
      throw new Error("Redis connection not initialized");
    }

    await this.#redis.del(key);
  }

  public async isValueInKey(object: {
    key: string;
    value: string | number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.#redis) {
        reject(new Error("Redis connection not initialized"));
        return;
      }

      this.#redis
        .sismember(object.key, object.value)
        .then((isValueInKey) => {
          resolve(!!isValueInKey);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async isKeyExists(key: string): Promise<boolean> {
    if (!this.#redis) {
      throw new Error("Redis connection not initialized");
    }

    const exists = await this.#redis.exists(key);
    return exists === 1;
  }

  public async incrementWithExpire(
    key: string,
    expireSeconds: number
  ): Promise<number> {
    if (!this.#redis) throw new Error("Redis connection not initialized");
    try {
      const count = await this.#redis.incr(key);

      if (count === 1) {
        await this.#redis.expire(key, expireSeconds);
      }

      return count;
    } catch (error) {
      return 0;
    }
  }

  public async setKeyWithExpire(
    key: string,
    value: string,
    expireSeconds: number
  ): Promise<void> {
    if (!this.#redis) throw new Error("Redis connection not initialized");

    return await this.#redis
      .set(key, value, "EX", expireSeconds)
      .then(() => {
        return;
      })
      .catch((error) => {
        Debug.error(`Error setting key with expire: ${error}`);
      });
  }

  public async getKeyWithExpire(
    key: string
  ): Promise<Record<string, any> | null> {
    if (!this.#redis) throw new Error("Redis connection not initialized");

    return await this.#redis
      .get(key)
      .then((value) => {
        if (!value) return null;
        return JSON.parse(value);
      })
      .catch((error) => {
        Debug.error(`Error getting key with expire: ${error}`);
      });
  }

  /**
   * Cierra la conexión a Valkey (Redis) de manera segura
   * @example
   * await redisServer.close();
   */
  public async close(): Promise<void> {
    if (!this.#redis) {
      return Debug.warning(
        "Valkey connection not initialized. Nothing to close."
      );
    }

    try {
      Debug.info("Closing Valkey connection...");
      await this.#redis.quit();
      this.#redis = undefined;
      Debug.success("Valkey connection closed successfully");
    } catch (error: any) {
      Debug.error("Error closing Valkey connection:");
      Debug.error(error as string);
      // Forzar cierre si quit() falla
      this.#redis?.disconnect();
      this.#redis = undefined;
    }
  }
}

export { RedisServer };
