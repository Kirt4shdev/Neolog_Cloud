import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { Spinner } from "@components/Spinner.tsx";
import { SpinnerProvider } from "@context/spinner/SpinnerProvider.tsx";
import { AuthProvider } from "@context/auth/AuthProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SpinnerProvider>
        <Spinner />
        <App />
      </SpinnerProvider>
    </AuthProvider>
  </StrictMode>
);
