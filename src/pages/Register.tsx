import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validarEmailInstitucional } from '../utils/validarDominio';

interface ApiResponse {
  codigoGerado?: string;
  error?: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [codigoReal, setCodigoReal] = useState('');
  const [passo, setPasso] = useState<1 | 2>(1);

  const enviarCodigoVerificacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErro('');

    const emailLower = email.toLowerCase().trim();

    if (!nome.trim()) {
      const msg = "Nome é obrigatório";
      setErro(msg);
      toast.warn(msg);
      return;
    }

    if (!emailLower) {
      const msg = "E-mail é obrigatório";
      setErro(msg);
      toast.warn(msg);
      return;
    }

    if (!validarEmailInstitucional(emailLower)) {
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

    if (senha !== confirmarSenha) {
      const msg = "As senhas não coincidem.";
      setErro(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3001/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailLower })
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.codigoGerado) {
        setCodigoReal(data.codigoGerado);
        setPasso(2);
        toast.success("Código enviado para seu e-mail institucional!");
      } else {
        const msg = data.error || "Erro ao enviar código de verificação.";
        setErro(msg);
        toast.error(msg);
      }

    } catch {
      const msg = "Erro de conexão. Verifique sua internet.";
      setErro(msg);
      toast.error(msg);

    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarCadastro = async () => {
    if (loading) return;

    if (codigoDigitado.trim() !== codigoReal.trim() || !codigoReal) {
      const msg = "Código incorreto. Verifique seu e-mail.";
      setErro(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3001/finalizar-cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha: senha
        })
      });

      if (response.ok) {
        toast.success("Cadastro finalizado com sucesso!");
        navigate('/login');
      } else if (response.status === 400) {
        toast.error("E-mail já cadastrado.");
      } else {
        toast.error("Erro ao salvar os dados no servidor.");
      }

    } catch {
      toast.error("Erro de conexão ao finalizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  if (passo === 2) {
    return (
      <div className="p-8 text-center bg-[#E8F5E9] rounded-xl shadow-lg max-w-md mx-auto mt-10 border border-green-100">
        <h2 className="text-2xl text-[#1B5E20] font-bold mb-4">Verifique seu E-mail</h2>
        <p className="text-[#2E7D32] mb-6">
          Enviamos um código de 6 dígitos para: <br />
          <strong className="break-all">{email}</strong>
        </p>

        <input
          type="text"
          placeholder="000000"
          maxLength={6}
          className="w-full border-2 border-[#2E7D32] p-3 rounded text-center text-2xl tracking-widest mb-4 outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          value={codigoDigitado}
          onChange={(e) => setCodigoDigitado(e.target.value.replace(/\D/g, ""))}
        />

        <button
          onClick={handleFinalizarCadastro}
          disabled={loading}
          className={`w-full bg-[#2E7D32] text-white font-bold py-3 rounded hover:bg-[#1B5E20] transition-all shadow-md active:scale-95 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Confirmando..." : "Confirmar Código"}
        </button>

        <button
          onClick={() => { setPasso(1); setCodigoDigitado(''); }}
          className="mt-4 text-sm text-gray-600 underline hover:text-gray-800 block w-full"
        >
          Trocar e-mail ou corrigir dados
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviarCodigoVerificacao} className="max-w-sm mx-auto mt-10 flex flex-col gap-4 p-6 bg-white shadow-xl rounded-lg border border-gray-100">

      <div className="flex flex-col items-center mb-2">
        <h2 className="text-2xl font-bold text-[#1B5E20]">Cadastro AgroSense</h2>
        <div className="h-1 w-16 bg-green-500 rounded-full mt-1"></div>
      </div>

      <p className="text-xs text-gray-500 text-center mb-4 italic">
        Acesso restrito a Coordenadores das Universidades Parceiras
      </p>

      {erro && (
        <div className="text-red-700 bg-red-50 p-3 rounded text-sm border border-red-200">
          {erro}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">Nome</label>
        <input
          type="text"
          placeholder="Seu nome completo"
          className="border p-3 rounded focus:border-[#2E7D32] focus:ring-1 focus:ring-green-500 outline-none transition-all"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">E-mail Institucional</label>
        <input
          type="email"
          placeholder="exemplo@discente.uemg.br"
          className="border p-3 rounded focus:border-[#2E7D32] focus:ring-1 focus:ring-green-500 outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">Senha</label>
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          className="border p-3 rounded focus:border-[#2E7D32] focus:ring-1 focus:ring-green-500 outline-none transition-all"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-600">Confirmar Senha</label>
        <input
          type="password"
          placeholder="Repita sua senha"
          className="border p-3 rounded focus:border-[#2E7D32] focus:ring-1 focus:ring-green-500 outline-none transition-all"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`bg-[#2E7D32] text-white p-3 rounded font-bold hover:bg-[#1B5E20] transition-all shadow-lg active:scale-95 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Enviando...' : 'Solicitar Acesso'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors mt-2"
      >
        Já tem uma conta? <span className="underline">Ir para login</span>
      </button>

    </form>
  );
};