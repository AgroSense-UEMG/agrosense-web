import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { AppLayout } from "@/layouts/AppLayout";

// Pages - App (Protegidas)
import { ProjectsPage } from "@/pages/app/ProjectsPage";
import { ProjectDashboardPage } from "@/pages/app/ProjectDashboardPage";
import { InventoryPage } from "@/pages/app/InventoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    // Redireciona para /app/projects temporariamente
    element: <Navigate to="/app/projects" replace />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/projects" replace />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        // ROTA DINÂMICA CONFIGURADA AQUI
        path: "projects/:projectId",
        element: <ProjectDashboardPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
    ],
  },
]);