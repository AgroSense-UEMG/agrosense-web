import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"

export default function CadastrarPesquisa() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  
  // 👇 Inicialização preguiçosa: Lê o autor direto na criação do estado
  const [autor] = useState(() => {
    const storedData = localStorage.getItem("usuarioLogado")
    if (storedData) {
      try {
        const user = JSON.parse(storedData)
        return user.nome || user.email
      } catch {
        return ""
      }
    }
    return ""
  })

  // 👇 O useEffect agora cuida APENAS do redirecionamento (Side Effect)
  useEffect(() => {
    const storedData = localStorage.getItem("usuarioLogado")
    
    if (!storedData) {
      toast.warn("Faça login para acessar esta página")
      navigate("/login", {
        state: {
          from: location.pathname
        }
      })
    }
  }, [navigate, location.pathname]) // Dependências corretas para evitar avisos amarelos

  const handleCadastrar = () => {
    if (!descricao.trim()) {
      toast.error("Por favor, descreva sua pesquisa.")
      return
    }

    const novaPesquisa = {
      id: Date.now(),
      autor: autor,
      nome: nome, 
      descricao: descricao,
      data: new Date().toLocaleDateString("pt-BR")
    }

    const pesquisasExistentes = JSON.parse(localStorage.getItem("pesquisas") || "[]")
    localStorage.setItem("pesquisas", JSON.stringify([novaPesquisa, ...pesquisasExistentes]))

    toast.success("Pesquisa cadastrada com sucesso!")
    navigate("/")
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Cadastrar Pesquisa
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-medium mb-1 ml-1">
            Nome da pesquisa
          </label>
          <input
            className="border w-full p-3 rounded-xl bg-gray-50 outline-none focus:border-green-600 transition-all"
            placeholder="Digite o nome da pesquisa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium mb-1 ml-1">
            Sua pesquisa
          </label>
          <textarea
            className="border w-full p-3 rounded-xl min-h-[120px] outline-none focus:border-green-600 transition-all resize-none"
            placeholder="Descreva sua pesquisa..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleCadastrar}
            className="bg-green-700 text-white w-full py-3 rounded-xl font-bold hover:bg-green-800 transition-transform active:scale-95 shadow-md"
          >
            Cadastrar Pesquisa
          </button>
          
          <button 
            onClick={() => navigate("/")}
            className="text-gray-500 text-sm hover:underline"
          >
            Cancelar e voltar
          </button>
        </div>

      </div>
    </div>
  )
}