import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceService } from "@/services/DeviceService";
import type { DeviceListItem, ProvisioningConfig } from "@/interfaces/Device";
import styles from "./styles/DashboardPage.module.css";

export function DashboardPage() {
  const [devices, setDevices] = useState<DeviceListItem[]>([]);
  const [provisioning, setProvisioning] = useState<ProvisioningConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [devicesData, provisioningData] = await Promise.all([
        DeviceService.getDeviceList(),
        DeviceService.getProvisioningStatus(),
      ]);
      setDevices(devicesData);
      setProvisioning(provisioningData);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProvisioning = async () => {
    if (!provisioning) return;
    try {
      const updated = await DeviceService.toggleProvisioning(!provisioning.isEnabled);
      setProvisioning(updated);
    } catch (err) {
      console.error("Error toggling provisioning:", err);
    }
  };

  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const offlineDevices = devices.filter((d) => d.status === "offline").length;
  const unknownDevices = devices.filter((d) => d.status === "unknown").length;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={loadDashboardData} className={styles.buttonRefresh}>
          Actualizar
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statTotal}`}>
            <div className={styles.statIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{devices.length}</div>
              <div className={styles.statLabel}>Total Dispositivos</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statOnline}`}>
            <div className={styles.statIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{onlineDevices}</div>
              <div className={styles.statLabel}>Online</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statOffline}`}>
            <div className={styles.statIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{offlineDevices}</div>
              <div className={styles.statLabel}>Offline</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statUnknown}`}>
            <div className={styles.statIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <circle cx="12" cy="17" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{unknownDevices}</div>
              <div className={styles.statLabel}>Desconocido</div>
            </div>
          </div>
        </div>

        {/* Provisioning Control */}
        <div className={styles.card}>
          <h2>Control de Provisioning</h2>
          <div className={styles.provisioningControl}>
            <div className={styles.provisioningInfo}>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={provisioning?.isEnabled ? styles.statusEnabled : styles.statusDisabled}
                >
                  {provisioning?.isEnabled ? "ACTIVO" : "DESACTIVADO"}
                </span>
              </p>
              <p className={styles.provisioningHint}>
                {provisioning?.isEnabled
                  ? "Los dispositivos pueden registrarse en el sistema"
                  : "El endpoint de provisión está bloqueado (403)"}
              </p>
            </div>
            <button onClick={handleToggleProvisioning} className={styles.buttonToggle}>
              {provisioning?.isEnabled ? "Desactivar" : "Activar"}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <h2>Acciones Rápidas</h2>
          <div className={styles.actionsGrid}>
            <button onClick={() => navigate("/admin/devices")} className={styles.actionButton}>
              <span className={styles.actionIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </span>
              <span>Ver Dispositivos</span>
            </button>
            <button onClick={() => navigate("/admin/users")} className={styles.actionButton}>
              <span className={styles.actionIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <span>Gestionar Usuarios</span>
            </button>
            <button onClick={loadDashboardData} className={styles.actionButton}>
              <span className={styles.actionIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </span>
              <span>Refrescar Datos</span>
            </button>
          </div>
        </div>

        {/* Recent Devices */}
        {devices.length > 0 && (
          <div className={styles.card}>
            <h2>Dispositivos Recientes</h2>
            <div className={styles.devicesList}>
              {devices.slice(0, 5).map((device) => (
                <div key={device.deviceId} className={styles.deviceItem}>
                  <div className={styles.deviceInfo}>
                    <span className={styles.deviceSN}>{device.serialNumber}</span>
                    <span className={styles.deviceDate}>
                      {new Date(device.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  <span
                    className={`${styles.deviceStatus} ${
                      styles[`status-${device.status}`]
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/admin/devices")}
              className={styles.buttonViewAll}
            >
              Ver Todos →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
