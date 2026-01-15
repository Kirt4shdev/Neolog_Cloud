import { Navigate } from "react-router-dom";
import { useAuth } from "@context/auth/useAuth";
import type { ReactNode } from "react";

export function ClientRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Verificar si el usuario tiene el rol client
  const hasClientRole = user?.roles && Array.isArray(user.roles) && user.roles.includes("client");

  return hasClientRole ? (
    children
  ) : (
    <Navigate to="/access-denied" replace />
  );
}
