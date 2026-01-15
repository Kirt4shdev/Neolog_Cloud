import { useState } from "react";
import { useTheme } from "@/context/theme/useTheme";
import { useAuth } from "@/context/auth/useAuth";
import styles from "../styles/ConfigurationPage.module.css";

export function ConfigurationPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <div className={styles.container}>
      {/* Header Fijo */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
          </svg>
          <h1>Configuración</h1>
        </div>
      </div>

      {/* Content con scroll */}
      <div className={styles.content}>
        {/* Apariencia */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <h2>Apariencia</h2>
          </div>
          <div className={styles.settingGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Tema</span>
                <span className={styles.settingDescription}>
                  Cambiar entre modo claro y oscuro
                </span>
              </div>
              <button onClick={toggleTheme} className={styles.themeButton}>
                {theme === "dark" ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <span>Modo Oscuro</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                    </svg>
                    <span>Modo Claro</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2>Notificaciones</h2>
          </div>
          <div className={styles.settingGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Notificaciones del sistema</span>
                <span className={styles.settingDescription}>
                  Recibir notificaciones en el navegador
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Alertas por email</span>
                <span className={styles.settingDescription}>
                  Recibir alertas importantes por correo electrónico
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <h2>Dashboard</h2>
          </div>
          <div className={styles.settingGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Actualización automática</span>
                <span className={styles.settingDescription}>
                  Refrescar los datos del dashboard automáticamente
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Cuenta */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2>Cuenta</h2>
          </div>
          <div className={styles.settingGroup}>
            <div className={styles.infoBox}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Usuario</span>
                <span className={styles.infoValue}>{user?.user.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user?.user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Roles</span>
                <div className={styles.roles}>
                  {user?.roles?.map((role) => (
                    <span key={role} className={styles.roleBadge}>
                      {role.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zona Peligrosa */}
        <div className={`${styles.section} ${styles.dangerZone}`}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h2>Zona Peligrosa</h2>
          </div>
          <div className={styles.settingGroup}>
            <div className={styles.dangerInfo}>
              <p className={styles.dangerText}>
                Las acciones en esta sección son irreversibles. Procede con precaución.
              </p>
              <button className={styles.dangerButton}>
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
