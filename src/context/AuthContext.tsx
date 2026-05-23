import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react"

import type {
  ReactNode,
} from "react"

interface Usuario {
  id?: number
  nome: string
  email: string
  foto?: string
}

interface AuthContextData {

  user: Usuario | null

  token: string | null

  login: (
    data: Usuario,
    accessToken: string,
    refreshToken?: string
  ) => void

  logout: () => void

  updateUser: (
    newData: Partial<Usuario>
  ) => void

  loading: boolean

  isAuthenticated: boolean
}

const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  )

const USER_KEY = "usuarioLogado"
const TOKEN_KEY = "token"
const REFRESH_KEY = "refresh"

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {

  const [user, setUser] =
    useState<Usuario | null>(null)

  const [token, setToken] =
    useState<string | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem(USER_KEY)

      const storedToken =
        localStorage.getItem(TOKEN_KEY)

      if (
        storedUser &&
        storedToken
      ) {

        const parsedUser =
          JSON.parse(storedUser)

        if (parsedUser?.email) {

          setUser(parsedUser)

          setToken(storedToken)

        } else {

          throw new Error(
            "Usuário inválido"
          )
        }
      }

    } catch (error) {

      console.error(
        "Erro ao recuperar login:",
        error
      )

      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)

    } finally {

      setLoading(false)
    }

  }, [])

  useEffect(() => {

    function syncAuth() {

      try {

        const storedUser =
          localStorage.getItem(USER_KEY)

        const storedToken =
          localStorage.getItem(TOKEN_KEY)

        if (
          storedUser &&
          storedToken
        ) {

          const parsedUser =
            JSON.parse(storedUser)

          if (parsedUser?.email) {

            setUser(parsedUser)
            setToken(storedToken)

            return
          }
        }

        setUser(null)
        setToken(null)

      } catch {

        setUser(null)
        setToken(null)
      }
    }

    window.addEventListener(
      "storage",
      syncAuth
    )

    return () => {

      window.removeEventListener(
        "storage",
        syncAuth
      )
    }

  }, [])

  const login = (
    data: Usuario,
    accessToken: string,
    refreshToken?: string
  ) => {

    setUser(data)

    setToken(accessToken)

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data)
    )

    localStorage.setItem(
      TOKEN_KEY,
      accessToken
    )

    if (refreshToken) {

      localStorage.setItem(
        REFRESH_KEY,
        refreshToken
      )
    }
  }

  const logout = () => {

    setUser(null)

    setToken(null)

    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  const updateUser = (
    newData: Partial<Usuario>
  ) => {

    setUser((prev) => {

      if (!prev) return null

      const updated = {
        ...prev,
        ...newData,
      }

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(updated)
      )

      return updated
    })
  }

  const isAuthenticated =
    !!user && !!token

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}