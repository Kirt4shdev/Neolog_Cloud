import mqtt, { MqttClient } from "mqtt";
import { Debug } from "@shared/utils/Debug";
import { envs } from "@shared/envs";
import { MQTT, MqttTopics } from "@shared/constants/mqtt";
import { container } from "tsyringe";
import type { IDeviceRepository } from "@core/device/repositories/IDeviceRepository";
import { influxDBService } from "@infrastructure/influxdb";

/**
 * MQTTService - Servicio para gestionar la conexión MQTT y procesar mensajes
 *
 * Este servicio actúa como RECEPTOR de mensajes de los dispositivos Neologg.
 * El backend NO envía heartbeats ni pings. Solo:
 * - Se suscribe a production/neologg/#
 * - Procesa mensajes recibidos (heartbeat, data, license)
 * - Publica acciones a production/neologg/{SN}/actions cuando el admin lo solicita
 * - Publica respuestas a /license si la licencia es inválida
 */
class MQTTService {
  private client: MqttClient | null = null;
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly protocol: string;

  constructor() {
    this.host = envs.MQTT_HOST;
    this.port = envs.MQTT_PORT;
    this.username = envs.MQTT_USERNAME;
    this.password = envs.MQTT_PASSWORD;
    this.protocol = envs.MQTT_PROTOCOL;
  }

  /**
   * Inicializa la conexión MQTT y se suscribe a los topics
   */
  public async init(): Promise<void> {
    try {
      Debug.info("Initializing MQTT connection...");

      const brokerUrl = `${this.protocol}://${this.host}:${this.port}`;

      this.client = mqtt.connect(brokerUrl, {
        username: this.username,
        password: this.password,
        clientId: `neologg-cloud-${Date.now()}`,
        clean: true,
        reconnectPeriod: MQTT.RECONNECT_PERIOD,
        connectTimeout: MQTT.CONNECT_TIMEOUT,
        keepalive: MQTT.KEEPALIVE,
      });

      // Listeners de eventos
      this.client.on("connect", () => this.onConnect());
      this.client.on("message", (topic, payload) =>
        this.onMessage(topic, payload)
      );
      this.client.on("error", (error) => this.onError(error));
      this.client.on("offline", () => this.onOffline());
      this.client.on("reconnect", () => this.onReconnect());

      Debug.success("MQTT client created");
    } catch (error: any) {
      Debug.error(`Failed to initialize MQTT: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handler cuando se conecta al broker MQTT
   */
  private onConnect(): void {
    Debug.success("Connected to MQTT broker");

    // Suscribirse a todos los topics de dispositivos Neologg
    const topic = MqttTopics.all();
    this.client?.subscribe(topic, { qos: MQTT.QOS_1 }, (error) => {
      if (error) {
        Debug.error(`Failed to subscribe to ${topic}: ${error.message}`);
      } else {
        Debug.success(`Subscribed to ${topic}`);
      }
    });
  }

  /**
   * Handler cuando se recibe un mensaje MQTT
   */
  private async onMessage(topic: string, payload: Buffer): Promise<void> {
    try {
      const message = payload.toString();
      Debug.info(`Received MQTT message on ${topic}`);

      // Extraer el serial number del topic
      // Format: production/neologg/{SN}/{type}
      const topicParts = topic.split("/");
      if (topicParts.length < 4 || topicParts[0] !== "production" || topicParts[1] !== "neologg") {
        Debug.warning(`Invalid topic format: ${topic}`);
        return;
      }

      const serialNumber = topicParts[2];
      const messageType = topicParts[3];

      // Procesar según el tipo de mensaje
      switch (messageType) {
        case MQTT.TOPIC_HEARTBEAT:
          await this.processHeartbeat(serialNumber, message);
          break;

        case MQTT.TOPIC_DATA:
          await this.processData(serialNumber, message);
          break;

        case MQTT.TOPIC_LICENSE:
          await this.processLicense(serialNumber, message);
          break;

        default:
          Debug.warning(`Unknown message type: ${messageType}`);
          await this.logUnknownTransmission(serialNumber, topic, message);
      }
    } catch (error: any) {
      Debug.error(`Error processing MQTT message: ${error.message}`);
    }
  }

  /**
   * Procesa un heartbeat recibido de un dispositivo
   */
  private async processHeartbeat(
    serialNumber: string,
    message: string
  ): Promise<void> {
    try {
      const deviceRepository = container.resolve<IDeviceRepository>("IDeviceRepository");

      // Actualizar lastSeenAt del dispositivo
      await deviceRepository.updateLastSeen(serialNumber);

      // Actualizar estado a online
      await deviceRepository.updateDeviceStatus(serialNumber, "online");

      // Registrar la transmisión
      await deviceRepository.logTransmission({
        serialNumber,
        topic: MqttTopics.heartbeat(serialNumber),
        payload: message,
        messageType: "heartbeat",
      });

      // Opcionalmente escribir en InfluxDB
      await influxDBService.writeHeartbeat(serialNumber);

      Debug.success(`Heartbeat processed for device: ${serialNumber}`);
    } catch (error: any) {
      Debug.error(`Error processing heartbeat: ${error.message}`);
    }
  }

  /**
   * Procesa datos de sensores recibidos de un dispositivo
   */
  private async processData(
    serialNumber: string,
    message: string
  ): Promise<void> {
    try {
      const deviceRepository = container.resolve<IDeviceRepository>("IDeviceRepository");

      // Registrar la transmisión en Postgres
      await deviceRepository.logTransmission({
        serialNumber,
        topic: MqttTopics.data(serialNumber),
        payload: message,
        messageType: "data",
      });

      // Parsear los datos JSON y escribir en InfluxDB
      try {
        const sensorData = JSON.parse(message);
        await influxDBService.writeSensorData(serialNumber, sensorData);
        Debug.success(`Sensor data written to InfluxDB for: ${serialNumber}`);
      } catch (parseError) {
        Debug.warning(`Failed to parse sensor data as JSON: ${message}`);
      }

      Debug.success(`Data processed for device: ${serialNumber}`);
    } catch (error: any) {
      Debug.error(`Error processing data: ${error.message}`);
    }
  }

  /**
   * Procesa validación de licencia recibida de un dispositivo
   */
  private async processLicense(
    serialNumber: string,
    receivedLicense: string
  ): Promise<void> {
    try {
      const deviceRepository = container.resolve<IDeviceRepository>("IDeviceRepository");

      // Obtener el device del repositorio
      const { result: deviceInfo } = await deviceRepository.getDeviceBySerialNumber(serialNumber);

      if (!deviceInfo) {
        Debug.warning(`Device not found: ${serialNumber}`);
        return;
      }

      // Obtener la licencia esperada
      const { result: device } = await deviceRepository.getDeviceDetail({
        deviceId: deviceInfo.deviceId,
      });

      if (!device) {
        return;
      }

      // Registrar la transmisión
      await deviceRepository.logTransmission({
        serialNumber,
        topic: MqttTopics.license(serialNumber),
        payload: receivedLicense,
        messageType: "license",
      });

      // Validar la licencia
      if (receivedLicense.trim() !== device.license) {
        Debug.warning(`Invalid license for device: ${serialNumber}`);

        // Publicar respuesta de error al dispositivo
        this.publishMessage(
          MqttTopics.license(serialNumber),
          JSON.stringify({
            valid: false,
            message: "Invalid license",
          })
        );
      } else {
        Debug.success(`License validated for device: ${serialNumber}`);
      }
    } catch (error: any) {
      Debug.error(`Error processing license: ${error.message}`);
    }
  }

  /**
   * Registra una transmisión de tipo desconocido
   */
  private async logUnknownTransmission(
    serialNumber: string,
    topic: string,
    message: string
  ): Promise<void> {
    try {
      const deviceRepository = container.resolve<IDeviceRepository>("IDeviceRepository");

      await deviceRepository.logTransmission({
        serialNumber,
        topic,
        payload: message,
        messageType: "unknown",
      });
    } catch (error: any) {
      Debug.error(`Error logging unknown transmission: ${error.message}`);
    }
  }

  /**
   * Publica un mensaje MQTT a un topic específico
   */
  public publishMessage(
    topic: string,
    message: string,
    qos: 0 | 1 | 2 = MQTT.QOS_1
  ): Promise<Result<void>> {
    return new Promise((resolve) => {
      if (!this.client || !this.client.connected) {
        resolve({
          error: {
            message: "MQTT client not connected",
            type: "internalServer",
          },
        });
        return;
      }

      this.client.publish(topic, message, { qos }, (error) => {
        if (error) {
          Debug.error(`Failed to publish to ${topic}: ${error.message}`);
          resolve({
            error: {
              message: `Failed to publish: ${error.message}`,
              type: "internalServer",
            },
          });
        } else {
          Debug.success(`Published message to ${topic}`);
          resolve({ result: undefined });
        }
      });
    });
  }

  /**
   * Publica una acción a un dispositivo específico
   */
  public async publishAction(
    serialNumber: string,
    action: string,
    payload?: any
  ): Promise<Result<void>> {
    const topic = MqttTopics.actions(serialNumber);
    const message = JSON.stringify({
      action,
      payload: payload || null,
      timestamp: new Date().toISOString(),
    });

    return this.publishMessage(topic, message);
  }

  /**
   * Handler de errores MQTT
   */
  private onError(error: Error): void {
    Debug.error(`MQTT error: ${error.message}`);
  }

  /**
   * Handler cuando el cliente MQTT queda offline
   */
  private onOffline(): void {
    Debug.warning("MQTT client offline");
  }

  /**
   * Handler cuando el cliente MQTT se reconecta
   */
  private onReconnect(): void {
    Debug.info("MQTT client reconnecting...");
  }

  /**
   * Cierra la conexión MQTT
   */
  public async close(): Promise<void> {
    try {
      if (this.client) {
        Debug.info("Closing MQTT connection...");
        await this.client.endAsync();
        this.client = null;
        Debug.success("MQTT connection closed");
      }
    } catch (error: any) {
      Debug.error(`Error closing MQTT: ${error.message}`);
    }
  }

  /**
   * Verifica si el cliente MQTT está conectado
   */
  public isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const mqttService = new MQTTService();
