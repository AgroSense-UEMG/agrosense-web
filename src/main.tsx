import { StrictMode } from "react"

import { createRoot } from "react-dom/client"

import { RouterProvider } from "react-router-dom"

import { TooltipProvider } from "@/components/ui/tooltip"

import { AuthProvider } from "@/context/AuthContext"

import { router } from "@/routes"

import "./index.css"

const rootElement =
  document.getElementById("root")

if (!rootElement) {
  throw new Error(
    "Root element not found"
  )
}

createRoot(rootElement).render(
  <StrictMode>

    <AuthProvider>

      <TooltipProvider>

        <RouterProvider
          router={router}
        />

      </TooltipProvider>

    </AuthProvider>

  </StrictMode>
)