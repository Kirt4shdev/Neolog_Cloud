import { LoginPage } from "@/pages/unprotected/LoginPage";
import { RegisterPage } from "@/pages/unprotected/RegisterPage";
import { HomePage } from "@/pages/common/HomePage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { DevicesPage } from "@/pages/admin/DevicesPage";
import { DeviceDetailPage } from "@/pages/admin/DeviceDetailPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { ClientPage } from "@/pages/client/ClientPage";
import { NotFoundPage } from "@/pages/unprotected/error/NotFoundPage";
import { AccessDeniedPage } from "@/pages/unprotected/error/AccessDeniedPage";
import { CommonPage } from "@/pages/common/CommonPage";
import { ProfilePage } from "@/pages/common/ProfilePage";
import { HelpPage } from "@/pages/common/HelpPage";
import { ConfigurationPage } from "@/pages/common/ConfigurationPage";
import type { ComponentType } from "react";

export type RouteType = "public" | "private" | "common" | "client" | "admin";

export interface RouteConfig {
  path: string;
  component: ComponentType;
  type: RouteType;
}

export const routesConfig: RouteConfig[] = [
  // Rutas públicas
  { path: "/login", component: LoginPage, type: "public" },
  { path: "/register", component: RegisterPage, type: "public" },

  // Rutas comunes (cualquier usuario autenticado)
  { path: "/home", component: HomePage, type: "common" },
  { path: "/common", component: CommonPage, type: "common" },
  { path: "/profile", component: ProfilePage, type: "common" },
  { path: "/help", component: HelpPage, type: "common" },
  { path: "/configuration", component: ConfigurationPage, type: "common" },

  // Rutas de cliente
  { path: "/client", component: ClientPage, type: "client" },

  // Rutas de administrador
  { path: "/admin", component: AdminPage, type: "admin" },
  { path: "/admin/dashboard", component: DashboardPage, type: "admin" },
  { path: "/admin/devices", component: DevicesPage, type: "admin" },
  { path: "/admin/devices/:deviceId", component: DeviceDetailPage, type: "admin" },
  { path: "/admin/users", component: UsersPage, type: "admin" },

  // Rutas privadas simples
  { path: "/not-found", component: NotFoundPage, type: "private" },
  { path: "/access-denied", component: AccessDeniedPage, type: "private" },
];
