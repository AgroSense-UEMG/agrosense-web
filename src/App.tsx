import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom"

import { useEffect } from "react"

import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/ui/landing/Navbar"

import { PrivateRoute } from "./routes/PrivateRoute"

// PÁGINAS PÚBLICAS
import LandingPage from "./pages/app/landing/LandingPage"
import Login from "./pages/app/landing/Login"
import { Register } from "./pages/app/landing/Register"

// PÁGINAS PRIVADAS
import { ProjectDashboardPage } from "./pages/app/ProjectDashboardPage"
import CadastrarPesquisa from "./pages/app/landing/CadastrarPesquisa"

function AppContent() {

  const navigate = useNavigate()

  const location = useLocation()

  // REDIRECIONAMENTO GLOBAL PARA LOGIN
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

    window.addEventListener(
      "redirectToLogin",
      handleRedirect
    )

    return () => {
      window.removeEventListener(
        "redirectToLogin",
        handleRedirect
      )
    }

  }, [navigate, location])

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)]">

        <Routes>

          {/* =========================
              🌐 ROTAS PÚBLICAS
          ========================== */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =========================
              🔐 ROTAS PRIVADAS
          ========================== */}

          <Route
            path="/dashboard/:id"
            element={
              <PrivateRoute>
                <ProjectDashboardPage />
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

          {/* =========================
              ❗ 404
          ========================== */}

          <Route
            path="*"
            element={<LandingPage />}
          />

        </Routes>

      </main>

      {/* =========================
          🔔 TOAST GLOBAL
      ========================== */}

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