import { useNavigate } from "react-router-dom";
import styles from "./styles/AdminPage.module.css";

export function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Header consistente */}
      <div className={styles.header}>
        <h1>Panel de Administración</h1>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.subtitle}>Neologg Cloud - Gestión de Dispositivos IoT</p>

        <div className={styles.grid}>
          <div className={styles.card} onClick={() => navigate("/admin/dashboard")}>
            <div className={styles.cardIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h2>Dashboard</h2>
            <p>Métricas globales y estado general del sistema</p>
          </div>

          <div className={styles.card} onClick={() => navigate("/admin/devices")}>
            <div className={styles.cardIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <h2>Dispositivos</h2>
            <p>Listado completo de dispositivos Neologg registrados</p>
          </div>

          <div className={styles.card} onClick={() => navigate("/admin/users")}>
            <div className={styles.cardIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2>Usuarios</h2>
            <p>Gestión de usuarios de la plataforma</p>
          </div>

          <div className={styles.card} onClick={() => navigate("/configuration")}>
            <div className={styles.cardIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
                <path d="M19.07 4.93l-4.24 4.24m0 5.66l4.24 4.24M4.93 19.07l4.24-4.24m5.66 0l4.24 4.24" />
              </svg>
            </div>
            <h2>Configuración</h2>
            <p>Ajustes generales del sistema</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>Funcionalidades Implementadas</h3>
          <ul className={styles.featureList}>
            <li>Provisioning de dispositivos con generación automática de licencias</li>
            <li>Conexión MQTT para recepción de telemetría (heartbeat, data, license)</li>
            <li>Almacenamiento en PostgreSQL + InfluxDB v2</li>
            <li>Gestión de usuarios Mosquitto con ACL</li>
            <li>Envío de acciones MQTT a dispositivos</li>
            <li>Control de estado online/offline</li>
            <li>Dashboard con métricas en tiempo real</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
