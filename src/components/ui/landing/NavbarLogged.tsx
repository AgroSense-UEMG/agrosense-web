import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logo from "@/assets/Logo.png"

interface Usuario {
  nome?: string
  email: string
}

export default function NavbarLogged() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // 👇 Inicialização preguiçosa (lazy initialization) direto na criação do estado
  const [usuario] = useState<Usuario | null>(() => {
    const storedData = localStorage.getItem("usuarioLogado")
    if (storedData) {
      try {
        return JSON.parse(storedData)
      } catch {
        return null
      }
    }
    return null
  })

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado")
    localStorage.removeItem("token")

    navigate("/login", { replace: true })
  }

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

        {/* MENU CENTRAL DESKTOP */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-6">

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

            <button onClick={irParaSobre}>Sobre</button>

            <Link
              to="/pesquisa"
              onClick={() => setMenuOpen(false)}
              className="bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Cadastrar Pesquisa
            </Link>

            <button onClick={irParaHome}>Home</button>

            <button
              onClick={() => {
                setMenuOpen(false)
                navigate("/app/projects")
              }}
            >
              {usuario?.nome || usuario?.email}
            </button>

            <button
              onClick={handleLogout}
              className="text-red-600"
            >
              Sair
            </button>

          </div>
        </div>
      )}
    </nav>
  )
}