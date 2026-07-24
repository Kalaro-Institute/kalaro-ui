import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getMe, login as apiLogin, logout as apiLogout } from "@/lib/auth.api";
import {
  clearAccessToken,
  clearRefreshToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/lib/api-client";
import type { AuthUser, LoginRequest, TokenPair } from "@/lib/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  onAuthSuccess: (tokens: TokenPair) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    async function restoreSession() {
      const refresh = getRefreshToken();
      if (!refresh) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL as string}/token/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          }
        );

        if (!res.ok) {
          clearAccessToken();
          clearRefreshToken();
          setIsLoading(false);
          return;
        }

        const { access } = (await res.json()) as { access: string };
        setAccessToken(access);
        const me = await getMe();
        setUser(me);
      } catch {
        clearAccessToken();
        clearRefreshToken();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    await apiLogin(data);
    const me = await getMe();
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const onAuthSuccess = useCallback(async (tokens: TokenPair) => {
    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
    const me = await getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, onAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}