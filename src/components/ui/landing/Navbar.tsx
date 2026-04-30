import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logo from "@/assets/Logo.png"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const irParaSobre = () => {
    setMenuOpen(false)

    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const irParaHome = () => {
    setMenuOpen(false)

    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="relative w-full px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} className="w-8 h-8" />
          <h1 className="text-lg font-bold text-green-700">AgroSense</h1>
        </Link>

        {/* MENU DESKTOP CENTRAL */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">

          <button
            onClick={irParaSobre}
            className="text-gray-700 hover:text-green-700 font-medium"
          >
            Sobre
          </button>

          <Link
            to="/pesquisa"
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 font-semibold shadow"
          >
            Cadastrar Pesquisa
          </Link>

          <button
            onClick={irParaHome}
            className="text-gray-700 hover:text-green-700 font-medium"
          >
            Home
          </button>
        </div>

        {/* DIREITA */}
        <div className="hidden md:flex items-center">
          <Link
            to="/login"
            className="text-gray-700 hover:text-green-700 font-medium"
          >
            Login
          </Link>
        </div>

        {/* BOTÃO MOBILE */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t z-50">
          <div className="flex flex-col items-center gap-4 py-4">

            <button
              onClick={irParaSobre}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Sobre
            </button>

            <Link
              to="/pesquisa"
              onClick={() => setMenuOpen(false)}
              className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Cadastrar Pesquisa
            </Link>

            <button
              onClick={irParaHome}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Home
            </button>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Login
            </Link>

          </div>
        </div>
      )}
    </nav>
  )
}