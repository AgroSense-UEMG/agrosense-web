import type { Project, Device, Member } from "@/types";

const API_URL = "http://127.0.0.1:8000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
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

    // Token inválido / expirado
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("usuarioLogado");
      window.dispatchEvent(new Event("redirectToLogin"));
      throw new Error("Sessão expirada.");
    }

    // Erro HTTP
    if (!response.ok) {
      let errorMessage = "Erro ao conectar com servidor";
      try {
        const errorData = (await response.json()) as Record<string, unknown>;
        errorMessage =
          (typeof errorData.message === "string" ? errorData.message : undefined) ??
          (typeof errorData.detail === "string" ? errorData.detail : undefined) ??
          errorMessage;
      } catch {
        /* corpo não é JSON — usa mensagem padrão */
      }
      throw new Error(errorMessage);
    }

    // No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    const message =
      error instanceof TypeError
        ? "Servidor indisponível."
        : error instanceof Error
          ? error.message
          : "Erro inesperado";

    console.error("API Error:", message);
    throw new Error(message);
  }
}

// =========================
// PROJECTS
// =========================

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>("/api/projects/");
}

export async function createProject(
  data: { name: string; description?: string }
): Promise<Project> {
  return request<Project>("/api/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================
// DEVICES
// =========================

export async function getDevices(): Promise<Device[]> {
  return request<Device[]>("/api/devices/");
}

export async function getDeviceById(id: number): Promise<Device> {
  return request<Device>(`/api/devices/${id}/`);
}

export async function updateDevice(
  id: number,
  data: { name?: string; project_id?: number | null }
): Promise<Device> {
  return request<Device>(`/api/devices/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// =========================
// MEMBERS (mock — substituir por API real)
// =========================

// TODO: substituir por GET /api/projects/{id}/members/ quando disponível
export async function getMembers(projectId: number): Promise<Member[]> {
  return request<Member[]>(`/api/projects/${projectId}/members/`);
}

export async function inviteMember(projectId: number, email: string): Promise<Member> {
  return request<Member>(`/api/projects/${projectId}/invite/`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
