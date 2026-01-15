import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import styles from "./styles/RegisterPage.module.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form.name, form.email, form.password);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated && user) return <Navigate to="/home" replace />;

  return (
    <div className={styles["register-container"]}>
      <form className={styles["register-form"]} onSubmit={handleSubmit}>
        <h1 className={styles["register-title"]}>Crear Cuenta</h1>

        {error && <div className={styles["error"]}>{error}</div>}

        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
          disabled={loading}
        />

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
          autoComplete="new-password"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Registrarse"}
        </button>

        <div className={styles["login-link"]}>
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")}>Inicia sesión aquí</span>
        </div>
      </form>
    </div>
  );
}
