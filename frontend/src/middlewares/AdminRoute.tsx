import { Navigate } from "react-router-dom";
import { useAuth } from "@context/auth/useAuth";
import type { ReactNode } from "react";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Verificar si el usuario tiene el rol admin
  const hasAdminRole = user?.roles && Array.isArray(user.roles) && user.roles.includes("admin");

  return hasAdminRole ? (
    children
  ) : (
    <Navigate to="/access-denied" replace />
  );
}
