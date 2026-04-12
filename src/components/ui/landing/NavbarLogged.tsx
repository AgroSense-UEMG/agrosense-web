import { useEffect, useState, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logo from "@/assets/Logo.png"

interface Usuario {
  nome?: string
  email: string
  foto?: string
}

export default function NavbarLogged() {
  const navigate = useNavigate()
  const location = useLocation()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const updateUser = () => {
      const storedData = localStorage.getItem("usuarioLogado")

      if (storedData) {
        try {
          setUsuario(JSON.parse(storedData))
        } catch {
          setUsuario(null)
        }
      } else {
        setUsuario(null)
      }
    }

    updateUser()

    window.addEventListener("userUpdated", updateUser)
    window.addEventListener("storage", updateUser)

    return () => {
      window.removeEventListener("storage", updateUser)
      window.removeEventListener("userUpdated", updateUser)
    }
  }, [])

  // Fecha dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado")
    localStorage.removeItem("token")

    window.dispatchEvent(new Event("userUpdated"))

    navigate("/login", {
      state: {
        from: location,
        precisaLogin: true,
      },
      replace: true,
    })
  }

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        <div className="flex justify-between items-center">
          {/* ESQUERDA → LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="AgroSense Logo" className="w-8 h-8" />
            <h1 className="text-lg font-bold text-green-700">AgroSense</h1>
          </Link>

          {/* CENTRO */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
            <Link
              to="/sobre"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Sobre
            </Link>

            <Link
              to="/pesquisa"
              className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 font-semibold shadow"
            >
              Cadastrar Pesquisas
            </Link>

            <Link
              to="/"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Home
            </Link>
          </div>

          {/* DIREITA */}
          <div className="hidden md:flex items-center gap-3 relative">
            {usuario && (
              <span className="text-sm text-gray-600 hidden lg:block">
                {usuario.nome || usuario.email}
              </span>
            )}

            {/* BOTÃO ENGRENAGEM */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
               className="text-2xl text-gray-700 hover:text-green-700 transition"
              title="Configurações"
            >
              ⚙️
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg w-56 overflow-hidden z-50"
              >

                <button
                  onClick={() => {
                    navigate("/app/gerenciar-pesquisas")
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 font-medium"
                >
                  ✏️ Gerenciar Pesquisas
                </button>

                <button
                  onClick={() => {
                    navigate("/app/redefinir-senha")
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 font-medium"
                >
                  🔑 Alterar Senha
                </button>

                <div className="border-t border-gray-200" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-semibold"
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MENU MOBILE */}
        {menuOpen && (
          <div className="mt-4 flex flex-col gap-3 md:hidden border-t pt-4">
            <Link to="/sobre" onClick={() => setMenuOpen(false)}>
              Sobre
            </Link>

            <Link to="/pesquisa" onClick={() => setMenuOpen(false)}>
              Cadastrar Pesquisa
            </Link>

            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/perfil" onClick={() => setMenuOpen(false)}>
              Perfil
            </Link>

            <Link
              to="/app/gerenciar-pesquisas"
              onClick={() => setMenuOpen(false)}
            >
              Gerenciar Pesquisas
            </Link>

            <Link
              to="/app/redefinir-senha"
              onClick={() => setMenuOpen(false)}
            >
              Alterar Senha
            </Link>

            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="text-red-500 text-left"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}