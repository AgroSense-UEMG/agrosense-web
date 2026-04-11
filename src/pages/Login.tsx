import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { login as apiLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { validarEmailInstitucional } from "../utils/validarDominio";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login: loginContext } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard/1";
  const precisaLogin = location.state?.precisaLogin;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (precisaLogin) {
      setErro("Faça o login para continuar");
    }
  }, [precisaLogin]);

  async function entrar() {
    if (loading) return;

    setErro("");

    const emailLimpo = email.toLowerCase().trim();

    if (!emailLimpo || !senha) {
      const msg = "Preencha todos os campos";
      setErro(msg);
      toast.warn(msg);
      return;
    }

    if (!validarEmailInstitucional(emailLimpo)) {
      const msg = "Use um e-mail institucional válido";
      setErro(msg);
      toast.error(msg);
      return;
    }

    if (senha.length < 6) {
      const msg = "A senha deve ter no mínimo 6 caracteres";
      setErro(msg);
      toast.warn(msg);
      return;
    }

    setLoading(true);

    try {
      const data = await apiLogin(emailLimpo, senha);

      loginContext({
        user: {
          nome: data.user.nome || "",
          email: data.user.email,
          foto: data.user.foto || "",
        },
        token: data.token,
      });

      toast.success("Bem-vindo ao AgroSense!");

      navigate(from, { replace: true });

    } catch (err: any) {
      let mensagem = "Erro ao fazer login";

      if (err?.response) {
        const status = err.response.status;

        if (status === 401) {
          mensagem = "E-mail ou senha inválidos";
        } else if (status === 403) {
          mensagem = "Conta não ativada";
        } else if (status === 500) {
          mensagem = "Erro no servidor";
        }
      } else {
        mensagem = "Erro de conexão";
      }

      setErro(mensagem);
      toast.error(mensagem);

    } finally {
      setLoading(false);
    }
  }

  const aoMudarEmail = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const aoMudarSenha = (e: ChangeEvent<HTMLInputElement>) =>
    setSenha(e.target.value);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100">

        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            Login AgroSense
          </h2>
          <div className="h-1 w-12 bg-green-600 rounded-full mt-1"></div>
        </div>

        <div className="space-y-4">

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

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
              Senha
            </label>
            <input
              type={mostrarSenha ? "text" : "password"}
              className="border w-full p-3 rounded outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              value={senha}
              onChange={aoMudarSenha}
            />
          </div>

          <label className="flex items-center text-sm cursor-pointer text-gray-600">
            <input
              type="checkbox"
              className="mr-2 accent-green-600"
              checked={mostrarSenha}
              onChange={() => setMostrarSenha(!mostrarSenha)}
            />
            Mostrar senha
          </label>

          <button
            onClick={entrar}
            disabled={loading}
            className={`bg-green-700 text-white w-full py-3 rounded font-bold flex justify-center items-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded text-center mt-4 font-semibold">
            {erro}
          </div>
        )}

        <p className="text-sm text-center mt-8 text-gray-600">
          Não possui uma conta?{" "}
          <Link to="/register" className="text-green-700 font-bold">
            Cadastrar-se
          </Link>
        </p>

      </div>
    </div>
  );
}