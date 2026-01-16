import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/auth/useAuth";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { routesConfig } from "./routesConfig";
import { PrivateRoute } from "@/middlewares/PrivateRoute";
import { AdminRoute } from "@/middlewares/AdminRoute";
import { ClientRoute } from "@/middlewares/ClientRoute";
import { CommonRoute } from "@/middlewares/CommonRoute";

export function AppRouter() {
  const { isAuthenticated } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <BrowserRouter>
      {isAuthenticated && <Sidebar isExpanded={sidebarExpanded} onToggle={setSidebarExpanded} />}
      <main className={
        isAuthenticated 
          ? `main-content with-sidebar ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`
          : "main-content"
      }>
        <Routes>
          {routesConfig.map((route) => {
            const Component = route.component;

            switch (route.type) {
              case "public":
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      isAuthenticated ? (
                        <Navigate to="/admin/dashboard" replace />
                      ) : (
                        <Component />
                      )
                    }
                  />
                );

              case "private":
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PrivateRoute>
                        <Component />
                      </PrivateRoute>
                    }
                  />
                );

              case "common":
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <CommonRoute>
                        <Component />
                      </CommonRoute>
                    }
                  />
                );

              case "client":
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <ClientRoute>
                        <Component />
                      </ClientRoute>
                    }
                  />
                );

              case "admin":
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <AdminRoute>
                        <Component />
                      </AdminRoute>
                    }
                  />
                );

              default:
                return null;
            }
          })}

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
