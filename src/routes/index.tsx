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
import CadastrarPesquisa from "@/pages/app/landing/CadastrarPesquisa";

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

      // 🔐 PROTEGIDA
      {
        path: "pesquisa",
        element: (
          <PrivateRoute>
            <CadastrarPesquisa />
          </PrivateRoute>
        ),
      },
    ],
  },

  // 🔐 ROTAS PRIVADAS DO SISTEMA
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="projects" replace /> },

      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:projectId", element: <ProjectDashboardPage /> },
      { path: "inventory", element: <InventoryPage /> },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);