import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { ReactNode } from "react";

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  foto?: string;
}

interface AuthContextData {
  user: Usuario | null;
  login: (data: Usuario, token: string) => void;
  logout: () => void;
  updateUser: (newData: Partial<Usuario>) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

const USER_KEY = "usuarioLogado";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (storedUser && storedToken) {
        const parsedUser: Usuario = JSON.parse(storedUser);

        if (parsedUser?.email) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          throw new Error("Usuário inválido");
        }
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function syncAuth() {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const storedToken = localStorage.getItem(TOKEN_KEY);

        if (storedUser && storedToken) {
          const parsedUser: Usuario = JSON.parse(storedUser);

          if (parsedUser?.email) {
            setUser(parsedUser);
            setToken(storedToken);
            return;
          }
        }

        setUser(null);
        setToken(null);
      } catch {
        setUser(null);
        setToken(null);
      }
    }

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authUpdated", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authUpdated", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    }
  }, [user, token]);

  const login = (data: Usuario, token: string) => {
    setUser(data);
    setToken(token);

    localStorage.setItem(USER_KEY, JSON.stringify(data));
    localStorage.setItem(TOKEN_KEY, token);

    window.dispatchEvent(new Event("authUpdated"));
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);

    window.dispatchEvent(new Event("authUpdated"));
  };

  const updateUser = (newData: Partial<Usuario>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };

      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new Event("authUpdated"));
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}