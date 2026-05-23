import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import type {
  ChangeEvent,
  FormEvent,
} from "react"

import { toast } from "react-toastify"

import { useAuth } from "../../../context/AuthContext"

const DOMINIOS_PERMITIDOS = [
  "uemg.br",
  "discente.uemg.br",
  "docente.uemg.br",
  "unitri.edu.br",
  "souunitri.com.br",
]

const API_URL = "http://127.0.0.1:8000"

type LoginResponse = {
  access: string
  refresh: string

  user: {
    id: number
    email: string
    nome: string
  }
}

export default function Login() {

  const navigate = useNavigate()

  const location = useLocation()

  const {
    login: loginContext,
  } = useAuth()

  const from =
    location.state?.from?.pathname ||
    "/app/projects"

  const precisaLogin =
    location.state?.precisaLogin

  const [email, setEmail] =
    useState("")

  const [senha, setSenha] =
    useState("")

  const [erro, setErro] =
    useState("")

  const [mostrarSenha, setMostrarSenha] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  // EMAIL
  const validarEmail = (
    email: string
  ) => {

    const emailLimpo =
      email.toLowerCase().trim()

    const regexEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!regexEmail.test(emailLimpo)) {
      return false
    }

    const dominioEmail =
      emailLimpo.split("@")[1]

    return DOMINIOS_PERMITIDOS.includes(
      dominioEmail
    )
  }

  useEffect(() => {

    if (precisaLogin) {

      setErro(
        "Faça login para continuar"
      )
    }

  }, [precisaLogin])

  async function entrar(
    e?: FormEvent
  ) {

    e?.preventDefault()

    if (loading) return

    setErro("")

    const emailLimpo =
      email.toLowerCase().trim()

    // CAMPOS
    if (!emailLimpo || !senha) {

      const msg =
        "Preencha todos os campos"

      setErro(msg)

      toast.warn(msg)

      return
    }

    // EMAIL
    if (!validarEmail(emailLimpo)) {

      const msg =
        "Use um e-mail institucional válido"

      setErro(msg)

      toast.error(msg)

      return
    }

    // SENHA
    if (senha.length < 6) {

      const msg =
        "A senha deve ter no mínimo 6 caracteres"

      setErro(msg)

      toast.warn(msg)

      return
    }

    setLoading(true)

    try {

      const response = await fetch(
        `${API_URL}/api/token/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: emailLimpo,
            password: senha,
          }),
        }
      )

      const data: LoginResponse =
        await response.json()

      // ERRO LOGIN
      if (!response.ok) {

        const mensagemErro =
          (data as any)?.detail ||
          "E-mail ou senha inválidos"

        setErro(mensagemErro)

        toast.error(mensagemErro)

        return
      }

      // TOKENS
      localStorage.setItem(
        "token",
        data.access
      )

      localStorage.setItem(
        "refresh",
        data.refresh
      )

      // USER
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(data.user)
      )

      // AUTH CONTEXT
      loginContext(
        {
          id: data.user.id,

          nome:
            data.user.nome,

          email:
            data.user.email,
        },

        data.access
      )

      toast.success(
        "Login realizado com sucesso!"
      )

      navigate(from, {
        replace: true,
      })

    } catch (err) {

      console.error(err)

      const msg =
        "Erro de conexão com a API."

      setErro(msg)

      toast.error(msg)

    } finally {

      setLoading(false)
    }
  }

  const aoMudarEmail = (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    setEmail(e.target.value)
  }

  const aoMudarSenha = (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    setSenha(e.target.value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">

          <h2 className="text-2xl font-bold text-green-800">
            Login AgroSense
          </h2>

          <div className="h-1 w-12 bg-green-600 rounded-full mt-1"></div>

        </div>

        {/* FORM */}
        <form
          onSubmit={entrar}
          className="space-y-4"
        >

          {/* EMAIL */}
          <div>

            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
              E-mail
            </label>

            <input
              type="email"

              className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"

              placeholder="seu.nome@uemg.br"

              value={email}

              onChange={aoMudarEmail}
            />

          </div>

          {/* SENHA */}
          <div>

            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
              Senha
            </label>

            <input
              type={
                mostrarSenha
                  ? "text"
                  : "password"
              }

              className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"

              placeholder="••••••••"

              value={senha}

              onChange={aoMudarSenha}
            />

          </div>

          {/* MOSTRAR SENHA */}
          <label className="flex items-center text-sm cursor-pointer text-gray-600">

            <input
              type="checkbox"

              className="mr-2 accent-green-600"

              checked={mostrarSenha}

              onChange={() =>
                setMostrarSenha(
                  !mostrarSenha
                )
              }
            />

            Mostrar senha

          </label>

          {/* BOTÃO */}
          <button
            type="submit"

            disabled={loading}

            className={`bg-green-700 text-white w-full py-3 rounded font-bold flex justify-center items-center gap-2 ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-800"
            }`}
          >

            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading
              ? "Entrando..."
              : "Entrar"}

          </button>

        </form>

        {/* ERRO */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded text-center mt-4 font-semibold">

            {erro}

          </div>
        )}

        {/* REGISTER */}
        <p className="text-sm text-center mt-8 text-gray-600">

          Não possui uma conta?{" "}

          <Link
            to="/register"
            className="text-green-700 font-bold"
          >
            Cadastrar-se
          </Link>

        </p>

      </div>
    </div>
  )
}