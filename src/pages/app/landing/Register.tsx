import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const API_URL = "http://127.0.0.1:8000"

type ErrorResponse = {
  email?: string[]
  password?: string[]
  detail?: string
}

export function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [loading, setLoading] = useState(false)

  const validarEmail = (email: string) => {
    const emailLimpo = email.trim().toLowerCase()

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!regexEmail.test(emailLimpo)) {
      return false
    }

    return emailLimpo.endsWith("@uemg.br")
  }

  const handleRegister = async (e?: FormEvent) => {
    e?.preventDefault()

    if (loading) return

    if (!nome || !email || !senha || !confirmarSenha) {
      toast.warn("Preencha todos os campos")
      return
    }

    const emailFormatado = email.trim().toLowerCase()

    if (!validarEmail(emailFormatado)) {
      toast.error("O email deve ser do domínio @uemg.br")
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

      const data: ErrorResponse = await response.json()

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso!")

        navigate("/login")

        return
      }

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

      toast.error(
        "Erro de conexão. Verifique se a API/Django está rodando."
      )

    } finally {
      setLoading(false)
    }
  }

  const aoMudarNome = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value)
  }

  const aoMudarEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const aoMudarSenha = (e: ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value)
  }

  const aoMudarConfirmarSenha = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmarSenha(e.target.value)
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

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={aoMudarNome}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            placeholder="Email (@uemg.br)"
            value={email}
            onChange={aoMudarEmail}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={aoMudarSenha}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={aoMudarConfirmarSenha}
            className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white w-full py-3 rounded font-bold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading
              ? "Criando conta..."
              : "Solicitar Acesso"}
          </button>

        </form>

      </div>
    </div>
  )
}