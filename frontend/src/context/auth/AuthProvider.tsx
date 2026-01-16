import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { AuthServices } from "@/services/api/AuthServices";
import { UserProfileServices } from "@/services/api/UserProfileServices";
import type { UserProfileEntity } from "@core/user-profile/entities/UserProfileEntity";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileEntity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const authServices = new AuthServices();
  const userProfileServices = new UserProfileServices();

  async function login(email: string, password: string) {
    try {
      await authServices.login({ email, password });
      const profile = await userProfileServices.getMyProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error: any) {
      // Extraer el mensaje de error de diferentes posibles rutas
      const errorMessage = 
        error?.response?.data?.error ||           // Backend: { error: "message" }
        error?.response?.data?.message ||         // Backend: { message: "message" }
        error?.response?.data?.error?.message ||  // Backend: { error: { message: "..." } }
        error?.message;                           // JavaScript Error
      
      // Si el error contiene "already logged in", hacer logout y reintentar
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes("already logged in")) {
        try {
          await authServices.logout();
          // Intentar login nuevamente
          await authServices.login({ email, password });
          const profile = await userProfileServices.getMyProfile();
          setUser(profile);
          setIsAuthenticated(true);
          return;
        } catch (retryError) {
          setIsAuthenticated(false);
          throw retryError;
        }
      }
      setIsAuthenticated(false);
      throw error;
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      await authServices.register({ name, email, password });
      const profile = await userProfileServices.getMyProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Register error:", error);
      setIsAuthenticated(false);
      throw error;
    }
  }

  async function logout() {
    return await authServices.logout().then(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  }

  async function refreshProfile() {
    try {
      const profile = await userProfileServices.getMyProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    // Solo se ejecuta al montar el componente para verificar sesión existente
    void refreshProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        initialLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
