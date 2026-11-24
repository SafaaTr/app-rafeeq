import React, { createContext, useContext, useState } from "react";
import { AuthUser, loginRequest, registerRequest } from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<AuthUser>;
  register: (name: string, phone: string, password: string, confirmPassword?: string) => Promise<AuthUser>;
  updateUser: (updatedUser: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (phone: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const data = await loginRequest(phone, password);
      setUser(data); // <-حفظ بيانات المستخدم اً
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    phone: string,
    password: string,
    confirmPassword?: string
  ): Promise<AuthUser> => {
    setLoading(true);
    try {
      const data = await registerRequest(name, phone, password, confirmPassword);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : (updatedUser as AuthUser)));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}