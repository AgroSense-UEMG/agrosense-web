import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { AppLayout } from "@/layouts/AppLayout";

// Pages - App (Protegidas)
import { ProjectsPage } from "@/pages/app/ProjectsPage";
import { ProjectDashboardPage } from "@/pages/app/ProjectDashboardPage";
import { InventoryPage } from "@/pages/app/InventoryPage";

/**
 * Configuração de rotas da aplicação AgroSense
 * 
 * Estrutura de Navegação (conforme especificação):
 * - / (Landing Page - Pública) - TODO: Dupla A
 * - /login (Tela de Login) - TODO: Dupla A
 * - /register (Tela de Cadastro) - TODO: Dupla A
 * - /app (Layout do Dashboard - Protegido)
 *   - /app/projects (Lista de Projetos - Home do Usuário)
 *   - /app/projects/:id (Dashboard Dinâmico de um Projeto)
 *   - /app/inventory (Inventário de Dispositivos - Apenas Coordenador)
 */
export const router = createBrowserRouter([
  {
    path: "/",
    // TODO: Redireciona para /app/projects temporariamente
    // Dupla A implementará a Landing Page
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
