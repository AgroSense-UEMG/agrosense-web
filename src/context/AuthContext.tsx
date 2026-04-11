import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  foto?: string;
}

interface AuthContextData {
  user: Usuario | null;
  login: (data: { user: Usuario; token: string }) => void;
  logout: () => void;
  updateUser: (newData: Partial<Usuario>) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioLogado");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);

        if (parsed?.email) {
          setUser(parsed);
        } else {
          throw new Error();
        }
      } catch {
        localStorage.clear();
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    function syncUser() {
      const storedUser = localStorage.getItem("usuarioLogado");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const parsed = JSON.parse(storedUser);

          if (parsed?.email) {
            setUser(parsed);
          } else {
            throw new Error();
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  const login = ({ user, token }: { user: Usuario; token: string }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuarioLogado", JSON.stringify(user));

    setUser(user);

    window.dispatchEvent(new Event("userUpdated"));
  };

  const logout = () => {
    setUser(null);

    localStorage.clear();

    window.dispatchEvent(new Event("userUpdated"));
  };

  const updateUser = (newData: Partial<Usuario>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated = { ...prev, ...newData };

      localStorage.setItem("usuarioLogado", JSON.stringify(updated));

      return updated;
    });

    window.dispatchEvent(new Event("userUpdated"));
  };

  const isAuthenticated = !!user && !!localStorage.getItem("token");

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

export const useAuth = () => {
  return useContext(AuthContext);
};