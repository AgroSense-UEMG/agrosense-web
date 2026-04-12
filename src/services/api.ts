const API_URL = "https://agrosense.eco.br";

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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioLogado");

      window.dispatchEvent(new Event("userUpdated"));
      window.dispatchEvent(new CustomEvent("redirectToLogin"));

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
    console.error("API Error:", error.message);

    if (error.message === "Failed to fetch") {
      throw new Error("Servidor indisponível. Tente novamente mais tarde.");
    }

    if (error.name === "TypeError") {
      throw new Error("Erro de conexão com a internet.");
    }

    throw new Error(
      error.message || "Erro inesperado ao comunicar com o servidor"
    );
  }
}

export async function login(email: string, password: string) {
  const data = await request<{ token: string; user: any }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("usuarioLogado", JSON.stringify(data.user));

  return data;
}

export async function getProjetos() {
  return request("/projects");
}

export async function createProjeto(data: any) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getDispositivos() {
  return request("/devices");
}

export async function getDispositivoById(id: string) {
  return request(`/devices/${id}`);
}

export async function getSensoresByPeriodo(
  startDate: string,
  endDate: string
) {
  return request(
    `/sensor-data?start=${startDate}&end=${endDate}`
  );
}