import "dotenv/config";
import { get } from "env-var";

const rawEnvs = () => {
  return {
    API_PORT: get("API_PORT").required().asPortNumber(),
    API_JWT_SECRET_TOKEN: get("API_JWT_SECRET_TOKEN").required().asString(),
    API_ALLOWED_CORS_ORIGINS: get("API_ALLOWED_CORS_ORIGINS")
      .required()
      .asString(),

    POSTGRES_CONNECTION_STRING: get("POSTGRES_CONNECTION_STRING")
      .required()
      .asString(),

    SMTP_HOST: get("SMTP_HOST").required().asString(),
    SMTP_PORT: get("SMTP_PORT").required().asInt(),
    SMTP_SECURE: get("SMTP_SECURE").required().asBool(),
    // SMTP_PUBLIC_API_KEY: get("SMTP_PUBLIC_API_KEY").required().asString(),
    // SMTP_PRIVATE_API_KEY: get("SMTP_PRIVATE_API_KEY").required().asString(),
    SMTP_FROM_ADDRESS: get("SMTP_FROM_ADDRESS").required().asString(),
    SMTP_USERNAME: get("SMTP_USERNAME").required().asString(),
    SMTP_PASSWORD: get("SMTP_PASSWORD").required().asString(),

    VALKEY_HOST: get("VALKEY_HOST").required().asString(),
    VALKEY_PORT: get("VALKEY_PORT").required().asPortNumber(),
    VALKEY_PASSWORD: get("VALKEY_PASSWORD").required().asString(),

    CRYPTO_TOOL_PASSWORD: get("CRYPTO_TOOL_PASSWORD").required().asString(),
    CRYPTO_TOOL_ALGORITHM: get("CRYPTO_TOOL_ALGORITHM").required().asString(),

    SHOW_DEV_LOGS: get("SHOW_DEV_LOGS").required().asBool(),

    ADMIN_AUTHORIZATION_HEADER: get("ADMIN_AUTHORIZATION_HEADER")
      .required()
      .asString(),

    EXECUTE_MODE: get("EXECUTE_MODE").required().asString(), // "dev" | "production"

    // Neologg Cloud - MQTT Configuration
    MQTT_HOST: get("MQTT_HOST").default("localhost").asString(),
    MQTT_PORT: get("MQTT_PORT").default(1883).asPortNumber(),
    MQTT_USERNAME: get("MQTT_USERNAME").default("neologg").asString(),
    MQTT_PASSWORD: get("MQTT_PASSWORD").default("neologg93").asString(),
    MQTT_PROTOCOL: get("MQTT_PROTOCOL").default("mqtt").asString(),

    // Neologg Cloud - InfluxDB v2 Configuration
    INFLUXDB_URL: get("INFLUXDB_URL")
      .default("http://localhost:8086")
      .asString(),
    INFLUXDB_TOKEN: get("INFLUXDB_TOKEN")
      .default("neologg93token_change_this_in_production")
      .asString(),
    INFLUXDB_ORG: get("INFLUXDB_ORG").default("neologg").asString(),
    INFLUXDB_BUCKET: get("INFLUXDB_BUCKET").default("neologg_data").asString(),

    // Neologg Cloud - Mosquitto Management
    MOSQUITTO_PASSWD_FILE: get("MOSQUITTO_PASSWD_FILE")
      .default("/etc/mosquitto/passwd/passwd")
      .asString(),
    MOSQUITTO_ACL_FILE: get("MOSQUITTO_ACL_FILE")
      .default("/etc/mosquitto/acl/acl")
      .asString(),
    MOSQUITTO_CONTAINER_NAME: get("MOSQUITTO_CONTAINER_NAME")
      .default("neologg_cloud_mosquitto")
      .asString(),
  };
};

const envs = rawEnvs();

export { envs };
