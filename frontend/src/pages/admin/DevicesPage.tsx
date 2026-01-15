import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceService } from "@/services/DeviceService";
import type { DeviceListItem } from "@/interfaces/Device";
import styles from "./styles/DevicesPage.module.css";

export function DevicesPage() {
  const [devices, setDevices] = useState<DeviceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await DeviceService.getDeviceList();
      setDevices(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar dispositivos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      online: styles["status-online"],
      offline: styles["status-offline"],
      unknown: styles["status-unknown"],
    }[status] || styles["status-unknown"];

    return <span className={`${styles.status} ${badgeClass}`}>{status.toUpperCase()}</span>;
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
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando dispositivos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={loadDevices} className={styles.button}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Dispositivos</h1>
        <button onClick={loadDevices} className={styles.buttonRefresh}>
          Actualizar
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{devices.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {devices.filter((d) => d.status === "online").length}
            </span>
            <span className={styles.statLabel}>Online</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {devices.filter((d) => d.status === "offline").length}
            </span>
            <span className={styles.statLabel}>Offline</span>
          </div>
        </div>

        {devices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay dispositivos registrados</p>
            <p className={styles.emptyHint}>
              Los dispositivos aparecerán aquí cuando se provisionen
            </p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Estado</th>
                  <th>Firmware</th>
                  <th>Última Conexión</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.deviceId}>
                    <td className={styles.serialNumber}>{device.serialNumber}</td>
                    <td>{getStatusBadge(device.status)}</td>
                    <td>{device.firmwareVersion || "N/A"}</td>
                    <td>{formatDate(device.lastSeenAt)}</td>
                    <td>{formatDate(device.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/admin/devices/${device.deviceId}`)}
                        className={styles.buttonDetail}
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
