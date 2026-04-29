const API_URL = "http://localhost:3001";

function getToken() {
  return localStorage.getItem("token");
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioLogado");


      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!response.ok) {
      let errorMessage = "Erro ao conectar com o servidor";

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    if (response.status === 204) return {} as T;

    return await response.json();
  } catch (error: any) {
    console.error("API Error:", error?.message || error);

    if (error instanceof TypeError) {
      throw new Error("Servidor indisponível ou erro de conexão.");
    }

    throw new Error(error?.message || "Erro inesperado");
  }
}

export async function login(email: string, password: string) {
  const data = await request<{ token: string; user: any }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("usuarioLogado", JSON.stringify(data.user));

  return data;
}

export async function enviarCodigo(email: string) {
  return request<{ codigoGerado: string }>("/api/enviar-codigo", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function finalizarCadastro(email: string, senha: string) {
  return request("/api/finalizar-cadastro", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export async function getProjetos() {
  return request("/api/projects");
}

export async function createProjeto(data: any) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getDispositivos() {
  return request("/api/devices");
}

export async function getDispositivoById(id: string) {
  return request(`/api/devices/${id}`);
}

export async function getSensoresByPeriodo(
  startDate: string,
  endDate: string
) {
  return request(`/api/sensor-data?start=${startDate}&end=${endDate}`);
}