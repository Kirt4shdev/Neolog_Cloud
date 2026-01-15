import { useAuth } from "@/context/auth/useAuth";
import styles from "../styles/ProfilePage.module.css";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h1>Por favor, inicia sesión para ver tu perfil</h1>
        </div>
      </div>
    );
  }

  function matchRole(role: string) {
    switch (role) {
      case "admin":
        return "Administrador";
      case "client":
        return "Cliente";
      default:
        return role;
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      {/* Header Fijo */}
      <div className={styles.header}>
        <h1>Perfil</h1>
      </div>

      {/* Content con scroll */}
      <div className={styles.content}>
        {/* User Header Card */}
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user.user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user.user.name}</h2>
            <p className={styles.userEmail}>{user.user.email}</p>
            <div className={styles.userRoles}>
              {user.roles?.map((role) => (
                <span key={role} className={styles.roleBadge}>
                  {matchRole(role)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className={styles.infoCards}>
          {/* Contacto */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <h3 className={styles.cardTitle}>Contacto</h3>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.user.email}</span>
            </div>
            {user.card && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Teléfono</span>
                <span className={styles.infoValue}>
                  {user.card.phonePrefix} {user.card.phoneNumber}
                </span>
              </div>
            )}
          </div>

          {/* Ubicación */}
          {user.card && (
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 className={styles.cardTitle}>Ubicación</h3>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>País</span>
                <span className={styles.infoValue}>{user.card.country}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ciudad</span>
                <span className={styles.infoValue}>{user.card.city}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Dirección</span>
                <span className={styles.infoValue}>
                  {user.card.address1}
                  {user.card.address2 && `, ${user.card.address2}`}
                </span>
              </div>
            </div>
          )}

          {/* Cuenta */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3 className={styles.cardTitle}>Cuenta</h3>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de registro</span>
              <span className={styles.infoValue}>
                {formatDate(user.user.createdAt as any)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>User ID</span>
              <span className={styles.infoValue}>{user.user.userId}</span>
            </div>
          </div>

          {/* Descripción */}
          {user.card?.description && (
            <div className={`${styles.infoCard} ${styles.descriptionCard}`}>
              <div className={styles.cardHeader}>
                <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3 className={styles.cardTitle}>Descripción</h3>
              </div>
              <div className={styles.descriptionText}>
                {user.card.description || (
                  <span className={styles.emptyDescription}>
                    No hay descripción disponible
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
