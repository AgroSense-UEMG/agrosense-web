import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logo from "@/assets/Logo.png"

interface Usuario {
  nome?: string
  email: string
}

export default function NavbarLogged() {
  const navigate = useNavigate()
  const location = useLocation()

  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem("usuarioLogado")

    if (storedData) {
      try {
        setUsuario(JSON.parse(storedData))
      } catch {
        setUsuario(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado")
    localStorage.removeItem("token")


    navigate("/login", { replace: true })
  }

  const irParaSobre = () => {
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
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AgroSense Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold text-green-700">AgroSense</h1>
        </Link>

        {/* MENU CENTRAL */}
        <div className="flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">

          <button
            onClick={irParaSobre}
            className="text-gray-700 hover:text-green-700 font-medium"
          >
            Sobre
          </button>

          <Link
            to="/pesquisa"
            className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 font-semibold shadow"
          >
            Cadastrar Pesquisa
          </Link>

          <button
            onClick={irParaHome}
            className="text-gray-700 hover:text-green-700 font-medium"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/app/projects")}
            className="text-gray-700 hover:text-green-700 font-medium"
          >
            {usuario?.nome || usuario?.email}
          </button>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sair
          </button>
        </div>

      </div>
    </nav>
  )
}