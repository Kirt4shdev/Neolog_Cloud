import styles from "../styles/HelpPage.module.css";

export function HelpPage() {
  return (
    <div className={styles.container}>
      {/* Header Fijo */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
          <h1>Ayuda</h1>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Introducción */}
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Centro de Ayuda NeoLogg Cloud</h2>
          <p className={styles.heroDescription}>
            Encuentra respuestas a las preguntas más frecuentes sobre la plataforma de gestión
            de dispositivos IoT.
          </p>
        </div>

        {/* Búsqueda Rápida */}
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar en la ayuda..."
            className={styles.searchInput}
          />
        </div>

        {/* FAQ Sections */}
        <div className={styles.sections}>
          {/* Primeros Pasos */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" />
              </svg>
              <h3>Primeros Pasos</h3>
            </div>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Cómo provisiono un nuevo dispositivo?</h4>
                <p className={styles.faqAnswer}>
                  Ve a Dashboard → Control de Provisioning → Habilitar. El sistema generará
                  credenciales temporales que debes configurar en tu dispositivo Neologg dentro
                  del tiempo límite especificado.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Cómo veo mis dispositivos?</h4>
                <p className={styles.faqAnswer}>
                  Navega a la sección "Dispositivos" desde el menú lateral. Allí verás una lista
                  completa de todos tus dispositivos registrados con su estado actual.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Qué significa cada estado del dispositivo?</h4>
                <p className={styles.faqAnswer}>
                  <strong>ONLINE:</strong> Dispositivo conectado y comunicándose.<br />
                  <strong>OFFLINE:</strong> Dispositivo registrado pero sin conexión.<br />
                  <strong>UNKNOWN:</strong> Estado indeterminado o sin datos suficientes.
                </p>
              </div>
            </div>
          </div>

          {/* Gestión de Dispositivos */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <h3>Gestión de Dispositivos</h3>
            </div>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Cómo envío comandos a un dispositivo?</h4>
                <p className={styles.faqAnswer}>
                  Accede al detalle del dispositivo y utiliza los botones de acción disponibles:
                  Reiniciar, Sincronizar Hora, Rotar Logs, o Solicitar Estado. Los comandos se
                  envían por MQTT automáticamente.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Dónde puedo ver los datos históricos?</h4>
                <p className={styles.faqAnswer}>
                  Los datos históricos se almacenan en InfluxDB. La visualización de gráficos
                  y tendencias estará disponible en futuras actualizaciones.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Puedo eliminar un dispositivo?</h4>
                <p className={styles.faqAnswer}>
                  Actualmente, la eliminación de dispositivos debe realizarse a través del
                  panel de administración del sistema. Contacta al soporte técnico si necesitas
                  remover un dispositivo.
                </p>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3>Seguridad</h3>
            </div>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Cómo funcionan las credenciales MQTT?</h4>
                <p className={styles.faqAnswer}>
                  Cada dispositivo recibe credenciales únicas generadas con SHA-256. Estas se
                  configuran automáticamente en Mosquitto con permisos específicos para cada
                  dispositivo.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Están encriptadas las comunicaciones?</h4>
                <p className={styles.faqAnswer}>
                  Sí, todas las comunicaciones MQTT están protegidas mediante autenticación.
                  Para entornos de producción, se recomienda habilitar TLS/SSL.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>¿Cómo cambio mi contraseña?</h4>
                <p className={styles.faqAnswer}>
                  Ve a Configuración → Cuenta → Cambiar Contraseña. Deberás proporcionar tu
                  contraseña actual y la nueva contraseña que deseas establecer.
                </p>
              </div>
            </div>
          </div>

          {/* Soporte Técnico */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3>Soporte Técnico</h3>
            </div>
            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <h4>Email</h4>
                <p>soporte@neologg.com</p>
              </div>
              <div className={styles.contactCard}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <h4>Teléfono</h4>
                <p>+34 900 123 456</p>
              </div>
              <div className={styles.contactCard}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h4>Horario</h4>
                <p>Lunes a Viernes<br />9:00 - 18:00 CET</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className={styles.footer}>
          <svg className={styles.footerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            ¿No encuentras lo que buscas? Contacta con nuestro equipo de soporte técnico para
            asistencia personalizada.
          </p>
        </div>
      </div>
    </div>
  );
}
