import { useNavigate } from "react-router-dom";
import styles from "./styles/AccessDeniedPage.module.css";

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Acceso Denegado</h1>
        
        <p className={styles.message}>
          No tienes permisos para acceder a esta página.
        </p>
        
        <p className={styles.submessage}>
          Contacta con el administrador si crees que esto es un error.
        </p>
        
        <button onClick={() => navigate("/home")} className={styles.button}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
