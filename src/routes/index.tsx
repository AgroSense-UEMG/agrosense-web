import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom"

import { AppLayout } from "@/layouts/AppLayout"
import { PublicLayout } from "@/layouts/PublicLayout"

import { PrivateRoute } from "@/routes/PrivateRoute"

// PÚBLICAS
import LandingPage from "@/pages/app/landing/LandingPage"
import Login from "@/pages/app/landing/Login"
import { Register } from "@/pages/app/landing/Register"

// PRIVADAS
import CadastrarPesquisa from "@/pages/app/landing/CadastrarPesquisa"

import { ProjectsPage } from "@/pages/app/ProjectsPage"

import { ProjectDashboardPage } from "@/pages/app/ProjectDashboardPage"

import { InventoryPage } from "@/pages/app/InventoryPage"

export const router =
  createBrowserRouter([
    // =================================
    // 🌐 PÚBLICAS
    // =================================
    {
      path: "/",

      element: <PublicLayout />,

      children: [
        {
          index: true,
          element: <LandingPage />,
        },

        {
          path: "login",
          element: <Login />,
        },

        {
          path: "register",
          element: <Register />,
        },

        // 🔐 ROTA PRIVADA ISOLADA
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

    // =================================
    // 🔐 ÁREA PRIVADA
    // =================================
    {
      path: "/app",

      element: (
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      ),

      children: [
        // REDIRECT
        {
          index: true,

          element: (
            <Navigate
              to="projects"
              replace
            />
          ),
        },

        // PROJETOS
        {
          path: "projects",

          element: <ProjectsPage />,
        },

        // DASHBOARD PROJETO
        {
          path: "projects/:projectId",

          element:
            <ProjectDashboardPage />,
        },

        // INVENTÁRIO
        {
          path: "inventory",

          element: <InventoryPage />,
        },
      ],
    },

    // =================================
    // ❗ 404
    // =================================
    {
      path: "*",

      element: (
        <Navigate
          to="/"
          replace
        />
      ),
    },
  ])