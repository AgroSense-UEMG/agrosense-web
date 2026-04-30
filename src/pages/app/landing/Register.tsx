import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const handleRegister = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      toast.warn("Preencha todos os campos")
      return
    }

    if (senha.length < 6) {
      toast.warn("A senha deve ter no mínimo 6 caracteres")
      return
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem")
      return
    }

    // Simulação de cadastro
    toast.success("Cadastro solicitado com sucesso!")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100">

        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            Cadastro
          </h2>
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
            type="email"
            placeholder="Email"
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
            onClick={handleRegister}
            className="bg-green-700 text-white w-full py-3 rounded font-bold hover:bg-green-800 transition"
          >
            Solicitar Acesso
          </button>

        </div>

      </div>
    </div>
  )
}