import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useEffect } from "react"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/ui/landing/Navbar"

import { PrivateRoute } from "./routes/PrivateRoute"

// Páginas públicas
import LandingPage from "./pages/app/landing/LandingPage"
import Login from "./pages/app/landing/Login"
import { Register } from "./pages/app/landing/Register"
import Sobre from "./pages/app/landing/Sobre"

import { ProjectDashboardPage } from "./pages/app/ProjectDashboardPage"

// Páginas privadas
import Perfil from "./pages/app/landing/Perfil"
import Contato from "./pages/app/landing/Contato"
import CadastrarPesquisa from "./pages/app/landing/CadastrarPesquisa"
import MinhasPesquisas from "./pages/app/landing/MinhasPesquisas"
import Historico from "./pages/app/landing/Historico"
import GerenciarPesquisas from "./pages/app/landing/GerenciarPesquisas"
import RedefinirSenha from "./pages/app/landing/RedefinirSenha"

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleRedirect = () => {
      navigate("/login", {
        state: {
          from: location,
          precisaLogin: true,
        },
        replace: true,
      })
    }

    window.addEventListener("redirectToLogin", handleRedirect)

    return () => {
      window.removeEventListener("redirectToLogin", handleRedirect)
    }
  }, [navigate, location])

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)]">
        <Routes>
          {/* 🌐 ROTAS PÚBLICAS */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sobre" element={<Sobre />} />

          {/* 🔐 ROTAS PRIVADAS */}
          <Route
            path="/dashboard/:id"
            element={
              <PrivateRoute>
                <ProjectDashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/historico/:id"
            element={
              <PrivateRoute>
                <Historico />
              </PrivateRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          <Route
            path="/minhas-pesquisas"
            element={
              <PrivateRoute>
                <MinhasPesquisas />
              </PrivateRoute>
            }
          />

          <Route
            path="/pesquisa"
            element={
              <PrivateRoute>
                <GerenciarPesquisas />
              </PrivateRoute>
            }
          />

          <Route
            path="/redefinir-senha"
            element={
              <PrivateRoute>
                <RedefinirSenha />
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastrar-pesquisa"
            element={
              <PrivateRoute>
                <CadastrarPesquisa />
              </PrivateRoute>
            }
          />

          <Route
            path="/pesquisa"
            element={
              <PrivateRoute>
                <CadastrarPesquisa />
              </PrivateRoute>
            }
          />

          <Route
            path="/contato"
            element={
              <PrivateRoute>
                <Contato />
              </PrivateRoute>
            }
          />

          {/* ❗ ROTA NÃO ENCONTRADA */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {/* 🔔 TOAST GLOBAL */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}