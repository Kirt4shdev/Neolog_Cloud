import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/axios/axios.instace";
import styles from "./styles/UsersPage.module.css";

interface UserProfile {
  user: {
    userId: string;
    name: string;
    email: string;
    createdAt: string;
  };
  card: any;
  roles: string[];
  sessions: any[];
  isBlacklisted: boolean;
}

export function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/admin/users-profiles");
      console.log("Response data:", response.data); // Debug
      setUsers(response.data.data || response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading users:", err);
      setError(err.response?.data?.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getRoleBadge = (roles: string[]) => {
    return roles.map((role, idx) => (
      <span key={idx} className={`${styles.roleBadge} ${styles[`role-${role}`]}`}>
        {role.toUpperCase()}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={loadUsers} className={styles.button}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Usuarios</h1>
        <button onClick={loadUsers} className={styles.buttonRefresh}>
          Actualizar
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Total Usuarios</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {users.filter((u) => u.roles.includes("admin")).length}
            </span>
            <span className={styles.statLabel}>Administradores</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {users.filter((u) => u.roles.includes("client")).length}
            </span>
            <span className={styles.statLabel}>Clientes</span>
          </div>
        </div>

        {users.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay usuarios registrados</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userProfile) => (
                  <tr key={userProfile.user.userId}>
                    <td className={styles.userName}>{userProfile.user.name}</td>
                    <td>{userProfile.user.email}</td>
                    <td>{getRoleBadge(userProfile.roles)}</td>
                    <td>{formatDate(userProfile.user.createdAt)}</td>
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
