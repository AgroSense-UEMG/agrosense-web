const API_URL = "http://127.0.0.1:8000"

function getToken() {
  return localStorage.getItem("token")
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),

    ...(options.headers || {}),
  }

  try {

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    )

    // TOKEN INVÁLIDO
    if (response.status === 401) {

      localStorage.removeItem("token")
      localStorage.removeItem("refresh")
      localStorage.removeItem("usuarioLogado")

      window.dispatchEvent(
        new Event("redirectToLogin")
      )

      throw new Error(
        "Sessão expirada."
      )
    }

    // ERROS
    if (!response.ok) {

      let errorMessage =
        "Erro ao conectar com servidor"

      try {

        const errorData =
          await response.json()

        errorMessage =
          errorData.message ||
          errorData.detail ||
          errorMessage

      } catch {}

      throw new Error(errorMessage)
    }

    // NO CONTENT
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()

  } catch (error: any) {

    console.error(
      "API Error:",
      error?.message || error
    )

    if (error instanceof TypeError) {

      throw new Error(
        "Servidor indisponível."
      )
    }

    throw new Error(
      error?.message ||
      "Erro inesperado"
    )
  }
}

// =========================
// PROJECTS
// =========================

export async function getProjetos() {
  return request("/api/projects/")
}

export async function createProjeto(
  data: any
) {
  return request("/api/projects/", {
    method: "POST",

    body: JSON.stringify(data),
  })
}

// =========================
// DEVICES
// =========================

export async function getDispositivos() {
  return request("/api/devices/")
}

export async function getDispositivoById(
  id: string
) {
  return request(
    `/api/devices/${id}/`
  )
}

// =========================
// SENSOR DATA
// =========================

export async function getSensoresByPeriodo(
  startDate: string,
  endDate: string
) {
  return request(
    `/api/sensor-data/?start=${startDate}&end=${endDate}`
  )
}