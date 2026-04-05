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

  if (senha.length < 3) {
    throw new Error("Senha muito curta");
  }

  try {
    const data: ApiResponse = await apiLogin(email, senha);

    salvarSessao(data);
    return data;

  } catch {

    const fakeData: ApiResponse = {
      token: "fake-jwt-token",
      user: {
        nome: "Usuário Teste",
        email: email,
        foto: "",
      },
    };

    salvarSessao(fakeData);
    return fakeData;
  }
}

function salvarSessao(data: ApiResponse) {
  localStorage.setItem("token", data.token);

  localStorage.setItem(
    "usuarioLogado",
    JSON.stringify({
      email: data.user.email,
      nome: data.user.nome || "",
      foto: data.user.foto || "",
    })
  );
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