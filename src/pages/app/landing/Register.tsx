import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { enviarCodigo, finalizarCadastro } from '@/services/api';

const DOMINIOS_PERMITIDOS = [
  'discente.uemg.br',
  'unitri.edu.br',
  'docente.uemg.br',
  'uemg.br',
  'souunitri.com.br'
];

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

  const validarEmail = (email: string) => {
    const emailLimpo = email.toLowerCase().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(emailLimpo)) return false;

    return DOMINIOS_PERMITIDOS.some(d => emailLimpo.endsWith(d));
  };

  const enviarCodigoVerificacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErro('');

    const emailLower = email.toLowerCase().trim();

    if (!nome.trim()) {
      const msg = "Nome é obrigatório";
      setErro(msg);
      return toast.warn(msg);
    }

    if (!emailLower) {
      const msg = "E-mail é obrigatório";
      setErro(msg);
      return toast.warn(msg);
    }

    if (!validarEmail(emailLower)) {
      const msg = "Use um e-mail institucional válido";
      setErro(msg);
      return toast.error(msg);
    }

    if (senha.length < 6) {
      const msg = "A senha deve ter no mínimo 6 caracteres";
      setErro(msg);
      return toast.warn(msg);
    }

    if (senha !== confirmarSenha) {
      const msg = "As senhas não coincidem.";
      setErro(msg);
      return toast.error(msg);
    }

    setLoading(true);

    try {
      const data = await enviarCodigo(emailLower);

      if (data.codigoGerado) {
        setCodigoReal(data.codigoGerado);
        setPasso(2);
        setErro('');
        toast.success("Código enviado para seu e-mail!");
      } else {
        throw new Error("Erro ao enviar código");
      }
    } catch (err: any) {
      const msg = err?.message || "Erro ao enviar código";
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
      await finalizarCadastro(email.toLowerCase().trim(), senha);

      toast.success("Cadastro finalizado com sucesso!");
      navigate('/login');
    } catch (err: any) {
      const msg = err?.message || "Erro ao finalizar cadastro";
      setErro(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (passo === 2) {
    return (
      <div className="p-8 text-center bg-[#E8F5E9] rounded-xl shadow-lg max-w-md mx-auto mt-10 border border-green-100">
        <h2 className="text-2xl text-[#1B5E20] font-bold mb-4">
          Verifique seu E-mail
        </h2>

        <p className="text-[#2E7D32] mb-6">
          Enviamos um código para: <br />
          <strong className="break-all">{email}</strong>
        </p>

        {/* ERRO AQUI TAMBÉM */}
        {erro && (
          <div className="text-red-700 bg-red-50 p-3 rounded text-sm border border-red-200 mb-4">
            {erro}
          </div>
        )}

        <input
          type="text"
          placeholder="000000"
          maxLength={6}
          className="w-full border-2 border-[#2E7D32] p-3 rounded text-center text-2xl tracking-widest mb-4"
          value={codigoDigitado}
          onChange={(e) => {
            setCodigoDigitado(e.target.value.replace(/\D/g, ""));
            setErro('');
          }}
        />

        <button
          onClick={handleFinalizarCadastro}
          disabled={loading}
          className="w-full bg-[#2E7D32] text-white py-3 rounded"
        >
          {loading ? "Confirmando..." : "Confirmar Código"}
        </button>

        <button
          onClick={() => {
            setPasso(1);
            setCodigoDigitado('');
            setErro('');
          }}
          className="mt-4 text-sm text-gray-600 underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={enviarCodigoVerificacao}
      className="max-w-sm mx-auto mt-10 flex flex-col gap-4 p-6 bg-white shadow-xl rounded-lg"
    >
      {/* ERRO */}
      {erro && (
        <div className="text-red-700 bg-red-50 p-3 rounded text-sm border border-red-200">
          {erro}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">Cadastro</h2>

      <input
        value={nome}
        onChange={(e) => {
          setNome(e.target.value);
          setErro('');
        }}
        placeholder="Nome"
      />

      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErro('');
        }}
        placeholder="Email"
      />

      <input
        type="password"
        value={senha}
        onChange={(e) => {
          setSenha(e.target.value);
          setErro('');
        }}
        placeholder="Senha"
      />

      <input
        type="password"
        value={confirmarSenha}
        onChange={(e) => {
          setConfirmarSenha(e.target.value);
          setErro('');
        }}
        placeholder="Confirmar senha"
      />

      <button type="submit">
        {loading ? "Enviando..." : "Solicitar Acesso"}
      </button>
    </form>
  );
};