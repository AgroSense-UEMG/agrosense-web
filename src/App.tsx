import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import Sobre from "./pages/Sobre";
import CadastrarPesquisa from "./pages/CadastrarPesquisa";
import Contato from "./pages/Contato";
import Perfil from "./pages/Perfil";
import MinhasPesquisas from "./pages/MinhasPesquisas";
import Historico from "./pages/Historico";
import GerenciarPesquisas from "./pages/GerenciarPesquisas";
import RedefinirSenha from "./pages/RedefinirSenha";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = () => {
      navigate("/login", {
        state: {
          from: location,
          precisaLogin: true
        },
        replace: true 
      });
    };

    window.addEventListener("redirectToLogin", handleRedirect);

    return () => {
      window.removeEventListener("redirectToLogin", handleRedirect);
    };
  }, [navigate, location]);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)]">
        <Routes>

          {/* 🌐 PÚBLICAS */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sobre" element={<Sobre />} />

          {/* 🔐 PRIVADAS */}
          <Route path="/dashboard/:id" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/historico/:id" element={<PrivateRoute><Historico /></PrivateRoute>} />
          <Route path="/pesquisa" element={<PrivateRoute><CadastrarPesquisa /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="/minhas-pesquisas" element={<PrivateRoute><MinhasPesquisas /></PrivateRoute>} />
          <Route path="/gerenciar-pesquisas" element={<PrivateRoute><GerenciarPesquisas /></PrivateRoute>} />
          <Route path="/redefinir-senha" element={<PrivateRoute><RedefinirSenha /></PrivateRoute>} />
          <Route path="/cadastrar-pesquisa" element={<PrivateRoute><CadastrarPesquisa /></PrivateRoute>} />

          {/* 📞 CONTATO PROTEGIDO */}
          <Route
            path="/contato"
            element={
              <PrivateRoute>
                <Contato />
              </PrivateRoute>
            }
          />

          {/* ❗ ROTA NÃO ENCONTRADA */}
          <Route
            path="*"
            element={<LandingPage />}
          />

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
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </BrowserRouter>
  );
}