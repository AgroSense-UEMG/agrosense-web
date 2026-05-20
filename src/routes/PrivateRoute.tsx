import { Navigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"

import { useAuth } from "@/context/AuthContext"

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({
  children,
}: PrivateRouteProps) {

  const {
    isAuthenticated,
    loading,
    token,
  } = useAuth()

  const location = useLocation()

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">

        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-500 text-sm">
          Verificando autenticação...
        </p>

      </div>
    )
  }

  // NÃO AUTENTICADO
  if (!isAuthenticated || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          precisaLogin: true,
        }}
      />
    )
  }

  // AUTENTICADO
  return <>{children}</>
}