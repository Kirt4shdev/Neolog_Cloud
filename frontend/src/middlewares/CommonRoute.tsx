import { Navigate } from "react-router-dom";
import { useAuth } from "@context/auth/useAuth";
import type { ReactNode } from "react";

export function CommonRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/access-denied" replace />;
}
