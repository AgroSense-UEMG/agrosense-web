import { Outlet } from "react-router-dom"
import Navbar from "@/components/ui/landing/Navbar"
import Footer from "@/components/ui/landing/Footer"

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}