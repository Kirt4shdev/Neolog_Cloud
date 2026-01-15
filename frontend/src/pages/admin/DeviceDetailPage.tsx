import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DeviceService } from "@/services/DeviceService";
import type { Device } from "@/interfaces/Device";
import styles from "./styles/DeviceDetailPage.module.css";

type DeviceAction = "restart" | "sync_time" | "rotate_logs" | "request_status";

export function DeviceDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingAction, setSendingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (deviceId) {
      loadDevice();
    }
  }, [deviceId]);

  const loadDevice = async () => {
    try {
      setLoading(true);
      const data = await DeviceService.getDeviceDetail(deviceId!);
      setDevice(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar dispositivo");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAction = async (action: DeviceAction) => {
    if (!deviceId) return;

    try {
      setSendingAction(true);
      setActionSuccess(null);
      setError(null);
      await DeviceService.sendDeviceAction(deviceId, action);
      setActionSuccess(`Acción "${action}" enviada correctamente`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar acción");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSendingAction(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    return {
      online: "#00ff88",
      offline: "#ff4d4d",
      unknown: "#ffc107",
    }[status] || "#6c757d";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando dispositivo...</div>
      </div>
    );
  }

  if (error && !device) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => navigate("/admin/devices")} className={styles.button}>
          Volver al listado
        </button>
      </div>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>{device.serialNumber}</h1>
        <button onClick={loadDevice} className={styles.buttonRefresh}>
          Actualizar
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {actionSuccess && <div className={styles.success}>{actionSuccess}</div>}
        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.grid}>
          {/* Estado */}
          <div className={styles.card}>
            <h2>Estado del Dispositivo</h2>
            <div className={styles.statusBig}>
              <span style={{ color: getStatusColor(device.status) }}>●</span>
              {device.status.toUpperCase()}
            </div>
            <div className={styles.statusInfo}>
              <p>
                <strong>Última Conexión:</strong> {formatDate(device.lastSeenAt)}
              </p>
            </div>
          </div>

          {/* Información General */}
          <div className={styles.card}>
            <h2>Información General</h2>
            <div className={styles.infoGrid}>
              <div>
                <label>Serial Number</label>
                <p>{device.serialNumber}</p>
              </div>
              <div>
                <label>MAC Address</label>
                <p>{device.macAddress}</p>
              </div>
              <div>
                <label>IMEI</label>
                <p>{device.imei}</p>
              </div>
              <div>
                <label>Licencia</label>
                <p className={styles.license}>{device.license.substring(0, 16)}...</p>
              </div>
            </div>
          </div>

          {/* Hardware/Software */}
          <div className={styles.card}>
            <h2>Hardware & Software</h2>
            <div className={styles.infoGrid}>
              <div>
                <label>Firmware</label>
                <p>{device.firmwareVersion || "N/A"}</p>
              </div>
              <div>
                <label>Hardware</label>
                <p>{device.hardwareVersion || "N/A"}</p>
              </div>
              <div>
                <label>Creado</label>
                <p>{formatDate(device.createdAt)}</p>
              </div>
              <div>
                <label>Actualizado</label>
                <p>{formatDate(device.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Localización */}
          <div className={styles.card}>
            <h2>Localización</h2>
            {device.latitude && device.longitude ? (
              <div className={styles.location}>
                <p>
                  <strong>Latitud:</strong> {device.latitude}
                </p>
                <p>
                  <strong>Longitud:</strong> {device.longitude}
                </p>
                <p>
                  <strong>Actualizado:</strong> {formatDate(device.locationUpdatedAt)}
                </p>
              </div>
            ) : (
              <p className={styles.noData}>Sin datos de localización</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className={styles.card}>
          <h2>Acciones del Dispositivo</h2>
          <p className={styles.actionsHint}>
            Enviar comandos MQTT al dispositivo (topic: production/neologg/{device.serialNumber}
            /actions)
          </p>
          <div className={styles.actionsGrid}>
            <button
              onClick={() => handleSendAction("restart")}
              disabled={sendingAction}
              className={`${styles.actionButton} ${styles.actionRestart}`}
            >
              Reiniciar
            </button>
            <button
              onClick={() => handleSendAction("sync_time")}
              disabled={sendingAction}
              className={`${styles.actionButton} ${styles.actionSync}`}
            >
              Sincronizar Hora
            </button>
            <button
              onClick={() => handleSendAction("rotate_logs")}
              disabled={sendingAction}
              className={`${styles.actionButton} ${styles.actionLogs}`}
            >
              Rotar Logs
            </button>
            <button
              onClick={() => handleSendAction("request_status")}
              disabled={sendingAction}
              className={`${styles.actionButton} ${styles.actionStatus}`}
            >
              Solicitar Estado
            </button>
          </div>
        </div>

        {/* Últimos Datos */}
        <div className={styles.card}>
          <h2>Últimos Datos Recibidos</h2>
          <p className={styles.comingSoon}>
            Dashboard con gráficos de InfluxDB - Próximamente
          </p>
        </div>
      </div>
    </div>
  );
}
