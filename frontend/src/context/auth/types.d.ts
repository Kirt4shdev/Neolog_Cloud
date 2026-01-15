import type { UserProfileEntity } from "@core/user-profile/entities/UserProfileEntity";
import type { Dispatch, SetStateAction } from "react";

export interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean | null>>;
  user: UserProfileEntity | null;
  initialLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
