import { Outlet } from "react-router-dom"
import Navbar from "@/components/ui/landing/Navbar"
import Footer from "@/components/ui/landing/Footer"

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}