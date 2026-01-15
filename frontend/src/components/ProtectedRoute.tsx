import { PrivateRoute } from "@middlewares/PrivateRoute";
import { CommonRoute } from "@middlewares/CommonRoute";
import { ClientRoute } from "@middlewares/ClientRoute";
import { AdminRoute } from "@middlewares/AdminRoute";
import type { ReactNode } from "react";

type RouteType = "public" | "private" | "common" | "client" | "admin";

interface ProtectedRouteProps {
  children: ReactNode;
  type: RouteType;
}

export function ProtectedRoute({ children, type }: ProtectedRouteProps) {
  if (type === "public") {
    return <>{children}</>;
  }

  if (type === "private") {
    return <PrivateRoute>{children}</PrivateRoute>;
  }

  if (type === "common") {
    return (
      <PrivateRoute>
        <CommonRoute>{children}</CommonRoute>
      </PrivateRoute>
    );
  }

  if (type === "client") {
    return (
      <PrivateRoute>
        <ClientRoute>{children}</ClientRoute>
      </PrivateRoute>
    );
  }

  if (type === "admin") {
    return (
      <PrivateRoute>
        <AdminRoute>{children}</AdminRoute>
      </PrivateRoute>
    );
  }

  return <>{children}</>;
}
