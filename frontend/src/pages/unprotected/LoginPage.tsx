import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import styles from "./styles/LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated && user) return <Navigate to="/home" replace />;

  const fillCredentials = (email: string, password: string) => {
    setForm({ email, password });
  };

  return (
    <div className={styles["login-container"]}>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <h1 className={styles["login-title"]}>Iniciar Sesión</h1>

        {error && <div className={styles["error"]}>{error}</div>}

        {/* Credenciales de prueba */}
        <div className={styles["test-credentials"]}>
          <div className={styles["test-credentials-title"]}>
            🧪 Credenciales de Prueba
          </div>
          
          <div className={styles["test-credential-item"]}>
            <div className={styles["test-credential-label"]}>
              👨‍💼 Super Admin
            </div>
            <div className={styles["test-credential-values"]}>
              <input
                type="text"
                readOnly
                value="superadmin@neologg.com"
                onClick={(e) => e.currentTarget.select()}
                className={styles["test-credential-input"]}
              />
              <input
                type="text"
                readOnly
                value="SuperAdmin123!"
                onClick={(e) => e.currentTarget.select()}
                className={styles["test-credential-input"]}
              />
            </div>
            <button
              type="button"
              onClick={() => fillCredentials("superadmin@neologg.com", "SuperAdmin123!")}
              className={styles["test-credential-button"]}
            >
              Usar estas credenciales
            </button>
          </div>

          <div className={styles["test-credential-item"]}>
            <div className={styles["test-credential-label"]}>
              👤 Usuario de Prueba
            </div>
            <div className={styles["test-credential-values"]}>
              <input
                type="text"
                readOnly
                value="test@test.com"
                onClick={(e) => e.currentTarget.select()}
                className={styles["test-credential-input"]}
              />
              <input
                type="text"
                readOnly
                value="Test123!"
                onClick={(e) => e.currentTarget.select()}
                className={styles["test-credential-input"]}
              />
            </div>
            <button
              type="button"
              onClick={() => fillCredentials("test@test.com", "Test123!")}
              className={styles["test-credential-button"]}
            >
              Usar estas credenciales
            </button>
          </div>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="username"
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Entrar"}
        </button>

        <div className={styles["register-link"]}>
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")}>Regístrate aquí</span>
        </div>
      </form>
    </div>
  );
}
