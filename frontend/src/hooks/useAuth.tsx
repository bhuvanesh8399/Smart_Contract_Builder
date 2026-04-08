import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../lib/api";
import { clearToken, getToken, setToken } from "../lib/auth";

type User = {
  id: number;
  full_name: string;
  email: string;
  freelancer_type?: string | null;
  is_active: boolean;
  created_at: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  full_name: string;
  email: string;
  password: string;
  freelancer_type?: string;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      if (!getToken()) {
        setUser(null);
        return;
      }
      const me = await api.get<User>("/auth/me");
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshMe().finally(() => setIsLoading(false));
  }, [refreshMe]);

  const login = async (payload: LoginPayload) => {
    const data = await api.post<AuthResponse>("/auth/login", payload);
    setToken(data.access_token);
    setUser(data.user);
  };

  const signup = async (payload: SignupPayload) => {
    const data = await api.post<AuthResponse>("/auth/signup", payload);
    setToken(data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      refreshMe,
    }),
    [user, isLoading, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
