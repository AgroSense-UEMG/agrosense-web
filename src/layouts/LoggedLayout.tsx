import { Outlet } from "react-router-dom"
import NavbarLogged from "@/components/ui/landing/NavbarLogged"
import Footer from "@/components/ui/landing/Footer"

export function LoggedLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarLogged />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}