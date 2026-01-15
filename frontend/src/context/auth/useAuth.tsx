import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used with a AuthProvider");

  return context;
}
