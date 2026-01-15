import { useNavigate } from "react-router-dom";
import styles from "./styles/NotFoundPage.module.css";

export function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate("/home");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorNumber}>404</div>
        
        <div className={styles.iconContainer}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Página no encontrada</h1>
        
        <p className={styles.message}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <p className={styles.submessage}>
          Verifica la URL o regresa a la página principal.
        </p>
        
        <div className={styles.buttonGroup}>
          <button onClick={() => navigate("/home")} className={styles.primaryButton}>
            Ir al Inicio
          </button>
          <button onClick={goBack} className={styles.secondaryButton}>
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}
