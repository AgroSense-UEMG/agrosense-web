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

// A IMPORTAÇÃO DO PORTEIRO
import PrivateRoute from "./components/ui/PrivateRoute"

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

    window.addEventListener("redirectToLogin", handleRedirect)

    return () => {
      window.removeEventListener("redirectToLogin", handleRedirect)
    }
  }, [navigate, location])

  // ==========================================
  // 🛡️ TRAVA ANTI-VOLTAR (Destrói o cache do navegador ao deslogar)
  // ==========================================
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // Se event.persisted for true, a página veio do cache (botão Voltar)
      if (event.persisted) {
        window.location.reload(); // Força o recarregamento limpo da página
      }
    }

    window.addEventListener("pageshow", handlePageShow)

    return () => {
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-72px)]">
        <Routes>
          {/* =========================
              🌐 ROTAS PÚBLICAS
          ========================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* =========================
              🔐 ROTAS PRIVADAS (A trava de segurança contra o Voltar)
          ========================== */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/:id" element={<ProjectDashboardPage />} />
            <Route path="/cadastrar-pesquisa" element={<CadastrarPesquisa />} />
            <Route path="/pesquisa" element={<CadastrarPesquisa />} />
          </Route>

          {/* =========================
              ❗ 404 (Página não encontrada)
          ========================== */}
          <Route path="*" element={<LandingPage />} />
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