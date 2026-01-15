import { createContext } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  setIsAuthenticated: function () {},
  user: null,
  initialLoading: true,
  login: async function () {},
  register: async function () {},
  logout: async function () {},
});
