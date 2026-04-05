import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  foto?: string;
}

interface AuthContextData {
  user: Usuario | null;
  login: (data: Usuario) => void;
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
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");
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

  useEffect(() => {
    if (user) {
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
    }
  }, [user]);

  const login = (data: Usuario) => {
    setUser(data);

    localStorage.setItem("usuarioLogado", JSON.stringify(data));

    window.dispatchEvent(new Event("userUpdated"));
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("userUpdated"));
  };

  const updateUser = (newData: Partial<Usuario>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...newData };
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