import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import logo from "@/assets/Logo.png"

interface Usuario {
  nome?: string
  email: string
  foto?: string
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
        {/* LINHA PRINCIPAL */}
        <div className="flex justify-between items-center">
          {/* ESQUERDA → LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="AgroSense Logo" className="w-8 h-8" />
            <h1 className="text-lg font-bold text-green-700">AgroSense</h1>
          </Link>

          {/* CENTRO */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
            <Link to="/sobre" className="text-gray-700 hover:text-green-700 font-medium">
              Sobre
            </Link>

            <Link
              to="/pesquisa"
              className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 font-semibold shadow"
            >
              Cadastrar Pesquisas
            </Link>

            <Link to="/" className="text-gray-700 hover:text-green-700 font-medium">
              Home
            </Link>
          </div>

          {/* DIREITA */}
          <div className="hidden md:flex items-center gap-3">
            {!usuario ? (
              <Link to="/login" className="text-gray-700 hover:text-green-700">
                Login
              </Link>
            ) : (
              <>
                <span className="text-sm text-gray-600 hidden lg:block">
                  {usuario.nome || usuario.email}
                </span>

                <button
                  onClick={() => navigate("/app/perfil")}
                  className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shadow"
                >
                  {usuario.foto ? (
                    <img
                      src={usuario.foto}
                      className="w-full h-full rounded-full object-cover"
                      alt="Foto do usuário"
                    />
                  ) : (
                    (usuario.nome || usuario.email).charAt(0).toUpperCase()
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Sair
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
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

            {!usuario ? (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/app/perfil")
                    setMenuOpen(false)
                  }}
                >
                  Perfil
                </button>

                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  className="text-red-500"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}