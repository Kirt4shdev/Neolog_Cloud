import styles from "@styles/components/NavBar.module.css";
import { useNavigate } from "react-router-dom";

export function NavigationLinks() {
  const navigate = useNavigate();

  return (
    <ul className={styles["nav-links"]}>
      <li>
        <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
      </li>
      <li>
        <button onClick={() => navigate("/admin")}>Admin</button>
      </li>
      <li>
        <button onClick={() => navigate("/client")}>Client</button>
      </li>
      <li>
        <button onClick={() => navigate("/common")}>Common</button>
      </li>
    </ul>
  );
}
