import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { AppLayout } from "@/layouts/AppLayout";
import { PublicLayout } from "@/layouts/PublicLayout";

// Private Route
import { PrivateRoute } from "@/routes/PrivateRoute";

// Páginas públicas
import LandingPage from "@/pages/app/landing/LandingPage";
import Login from "@/pages/app/landing/Login";
import { Register } from "@/pages/app/landing/Register";
import Sobre from "@/pages/app/landing/Sobre";
import Contato from "@/pages/app/landing/Contato";
import CadastrarPesquisa from "@/pages/app/landing/CadastrarPesquisa";

// Privadas
import Perfil from "@/pages/app/landing/Perfil";
import GerenciarPesquisas from "@/pages/app/landing/GerenciarPesquisas";
import RedefinirSenha from "@/pages/app/landing/RedefinirSenha";

// Sistema
import { ProjectsPage } from "@/pages/app/ProjectsPage";
import { ProjectDashboardPage } from "@/pages/app/ProjectDashboardPage";
import { InventoryPage } from "@/pages/app/InventoryPage";

export const router = createBrowserRouter([
  // 🌐 ROTAS PÚBLICAS
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "sobre", element: <Sobre /> },
      { path: "contato", element: <Contato /> },
      { path: "pesquisa", element: <CadastrarPesquisa /> },
    ],
  },

  // 🔐 ROTAS PRIVADAS
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      // redirect padrão
      { index: true, element: <Navigate to="projects" replace /> },

      // Sistema
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:projectId", element: <ProjectDashboardPage /> },
      { path: "inventory", element: <InventoryPage /> },

      // Privadas
      { path: "perfil", element: <Perfil /> },
      { path: "redefinir-senha", element: <RedefinirSenha /> },
      { path: "gerenciar-pesquisas", element: <GerenciarPesquisas /> },
    ],
  },

  // ❗ fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);