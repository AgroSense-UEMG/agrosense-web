import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const API_URL = "http://127.0.0.1:8000"

export function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: any) => {
    if (e && e.preventDefault) e.preventDefault()

    if (loading) return

    if (!nome || !email || !senha || !confirmarSenha) {
      toast.warn("Preencha todos os campos")
      return
    }

    const emailFormatado = email.trim().toLowerCase()

    if (!emailFormatado.endsWith("uemg.br")) {
      toast.error("O email deve ser da instituição UEMG (@uemg.br ou @discente.uemg.br)")
      return
    }

    if (senha.length < 6) {
      toast.warn("A senha deve ter no mínimo 6 caracteres")
      return
    }

    if (senha !== confirmarSenha) {
      toast.warn("As senhas não coincidem")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: nome.trim(),
          last_name: "", 
          email: emailFormatado,
          password: senha,
        }),
      })

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso!")
        navigate("/login")
        return
      }

      const data = await response.json()
      console.log("Erro API register:", data)

      if (data?.email) {
        toast.error(`Email: ${data.email[0]}`)
      } else if (data?.password) {
        toast.error(`Senha: ${data.password[0]}`)
      } else if (data?.detail) {
        toast.error(data.detail)
      } else {
        toast.error("Erro ao criar conta")
      }

    } catch (error) {
      console.error(error)
      toast.error("Erro de conexão. Verifique se a API está rodando.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Cadastro</h2>
          <div className="h-1 w-12 bg-green-600 rounded-full mt-1"></div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Email (@uemg.br)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-700 text-white w-full py-3 rounded font-bold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Solicitar Acesso"}
          </button>
        </div>
      </div>
    </div>
  )
}