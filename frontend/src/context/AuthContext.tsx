import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { api, type User } from "../lib/api";
import { authStorage } from "../lib/auth";

type SignupPayload = {
  full_name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await api.me(token);
      setUser(currentUser);
    } catch {
      authStorage.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload) => {
    const response = await api.login(payload);
    authStorage.setToken(response.access_token);
    setUser(response.user);
  };

  const signup = async (payload: SignupPayload) => {
    const response = await api.signup(payload);
    authStorage.setToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    authStorage.clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
