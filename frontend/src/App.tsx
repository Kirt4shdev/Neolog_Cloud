import { AppRouter } from "@router/AppRouter";
import { useAuth } from "@context/auth/useAuth";
import { ThemeProvider } from "@/context/theme/ThemeProvider";
import "./App.css";

export function App() {
  const { initialLoading } = useAuth();

  if (initialLoading) return null;

  return (
    <ThemeProvider>
      <div className="app-container">
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}
