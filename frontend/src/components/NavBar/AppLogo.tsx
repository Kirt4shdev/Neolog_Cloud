import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import styles from "@styles/components/AppLogo.module.css";

export function AppLogo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function goToHomePage() {
    // Redirigir según el rol del usuario
    const userRoles = user?.roles || [];
    if (userRoles.includes("super_admin") || userRoles.includes("admin")) {
      navigate("/admin/dashboard");
    } else {
      navigate("/client");
    }
  }

  return (
    <span className={styles["app-logo"]} onClick={goToHomePage}>
      AppLogo
    </span>
  );
}
