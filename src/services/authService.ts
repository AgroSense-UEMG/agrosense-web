import { login as apiLogin } from "./api";

interface ApiResponse {
  token: string;
  user: {
    id?: number;
    nome?: string;
    email: string;
    foto?: string;
  };
}

export async function login(email: string, senha: string) {
  if (!email.endsWith("@uemg.br")) {
    throw new Error("Use um email institucional (@uemg.br)");
  }

  if (senha.length < 6) {
    throw new Error("A senha deve ter no mínimo 6 caracteres");
  }

  try {
    const data: ApiResponse = await apiLogin(email, senha);
    return data;
  } catch (err) {
    throw err;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioLogado");

  window.dispatchEvent(new Event("userUpdated"));
}

export function getUsuario() {
  const user = localStorage.getItem("usuarioLogado");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}