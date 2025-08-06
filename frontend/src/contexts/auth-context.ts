import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  especialidade?: string;
  crm?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
