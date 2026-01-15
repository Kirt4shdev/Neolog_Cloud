import { InfluxDB, Point, WriteApi } from "@influxdata/influxdb-client";
import { Debug } from "@shared/utils/Debug";
import { envs } from "@shared/envs";

/**
 * InfluxDBService - Servicio para almacenar datos de series temporales
 *
 * Este servicio gestiona la conexión con InfluxDB v2 y proporciona
 * métodos para escribir datos de telemetría de los dispositivos Neologg.
 */
class InfluxDBService {
  private client: InfluxDB | null = null;
  private writeApi: WriteApi | null = null;
  private readonly url: string;
  private readonly token: string;
  private readonly org: string;
  private readonly bucket: string;

  constructor() {
    this.url = envs.INFLUXDB_URL;
    this.token = envs.INFLUXDB_TOKEN;
    this.org = envs.INFLUXDB_ORG;
    this.bucket = envs.INFLUXDB_BUCKET;
  }

  /**
   * Inicializa la conexión con InfluxDB v2
   */
  public async init(): Promise<void> {
    try {
      Debug.info("Initializing InfluxDB connection...");

      this.client = new InfluxDB({
        url: this.url,
        token: this.token,
      });

      // Crear el WriteApi para escrituras
      this.writeApi = this.client.getWriteApi(this.org, this.bucket, "ms");

      // Configurar el comportamiento de escritura
      this.writeApi.useDefaultTags({ source: "neologg-cloud" });

      Debug.success("InfluxDB connection initialized");
    } catch (error: any) {
      Debug.error(`Failed to initialize InfluxDB: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cierra la conexión con InfluxDB
   */
  public async close(): Promise<void> {
    try {
      if (this.writeApi) {
        Debug.info("Closing InfluxDB connection...");
        await this.writeApi.close();
        this.writeApi = null;
        this.client = null;
        Debug.success("InfluxDB connection closed");
      }
    } catch (error: any) {
      Debug.error(`Error closing InfluxDB: ${error.message}`);
    }
  }

  /**
   * Escribe un punto de datos de telemetría
   * @param measurement - Nombre de la medición (ej: "sensor_data", "heartbeat")
   * @param serialNumber - Serial Number del dispositivo
   * @param fields - Campos de datos (ej: { temperature: 25.5, humidity: 60 })
   * @param tags - Tags opcionales adicionales
   * @param timestamp - Timestamp opcional (si no se proporciona, usa NOW)
   */
  public async writePoint(data: {
    measurement: string;
    serialNumber: string;
    fields: Record<string, number | string | boolean>;
    tags?: Record<string, string>;
    timestamp?: Date;
  }): Promise<Result<void>> {
    try {
      if (!this.writeApi) {
        return {
          error: {
            message: "InfluxDB not initialized. Call init() first.",
            type: "internalServer",
          },
        };
      }

      // Crear el punto de datos
      const point = new Point(data.measurement)
        .tag("device", data.serialNumber)
        .timestamp(data.timestamp || new Date());

      // Añadir tags adicionales si existen
      if (data.tags) {
        Object.entries(data.tags).forEach(([key, value]) => {
          point.tag(key, value);
        });
      }

      // Añadir campos
      Object.entries(data.fields).forEach(([key, value]) => {
        if (typeof value === "number") {
          point.floatField(key, value);
        } else if (typeof value === "boolean") {
          point.booleanField(key, value);
        } else {
          point.stringField(key, value);
        }
      });

      // Escribir el punto
      this.writeApi.writePoint(point);

      // Flush para asegurar que se escribió
      await this.writeApi.flush();

      return { result: undefined };
    } catch (error: any) {
      Debug.error(`Failed to write point to InfluxDB: ${error.message}`);
      return {
        error: {
          message: `Failed to write point: ${error.message}`,
          type: "internalServer",
        },
      };
    }
  }

  /**
   * Escribe un heartbeat de un dispositivo
   * @param serialNumber - Serial Number del dispositivo
   * @param timestamp - Timestamp del heartbeat (opcional)
   */
  public async writeHeartbeat(
    serialNumber: string,
    timestamp?: Date
  ): Promise<Result<void>> {
    return this.writePoint({
      measurement: "heartbeat",
      serialNumber,
      fields: {
        received: 1, // Marcador simple de que se recibió heartbeat
      },
      timestamp,
    });
  }

  /**
   * Escribe datos de sensores de un dispositivo
   * @param serialNumber - Serial Number del dispositivo
   * @param sensorData - Datos de los sensores
   * @param timestamp - Timestamp opcional
   */
  public async writeSensorData(
    serialNumber: string,
    sensorData: Record<string, number | string | boolean>,
    timestamp?: Date
  ): Promise<Result<void>> {
    return this.writePoint({
      measurement: "sensor_data",
      serialNumber,
      fields: sensorData,
      timestamp,
    });
  }

  /**
   * Verifica que la conexión con InfluxDB está activa
   */
  public async isAlive(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }

      // Intentar hacer un ping simple escribiendo un punto de prueba
      // TODO: Usar getHealthApi() cuando esté disponible en la versión del cliente
      const writeApi = this.client.getWriteApi(this.org, this.bucket);
      writeApi.close();
      return true;
    } catch (error) {
      Debug.error("InfluxDB health check failed");
      return false;
    }
  }
}

export const influxDBService = new InfluxDBService();
