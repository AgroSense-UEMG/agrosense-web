/**
 * Dados Mockados - Projetos
 *
 * TODO: Substituir por dados reais da API na Sprint 2
 * Endpoints esperados:
 * - GET /api/projects/ (lista de projetos)
 * - GET /api/projects/{id}/ (detalhes do projeto)
 */

import type { Project, ProjectDetails } from "@/types";

/**
 * Lista de projetos para a tela de listagem
 * Conforme especificação: Título, Descrição curta, Nome do Coordenador e Status
 */
export const mockProjects: Project[] = [
  {
    id: 1,
    name: "Monitoramento de Solo - Fazenda Santa Clara",
    description:
      "Análise contínua de umidade, pH e temperatura do solo para otimização de irrigação em lavoura de café.",
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Estação Meteorológica - Campus UEMG",
    description:
      "Coleta de dados climáticos para correlação com dados de solo e estudos acadêmicos.",
    created_at: "2026-02-20T14:30:00Z",
  },
  {
    id: 3,
    name: "Irrigação Inteligente - Horta Comunitária",
    description:
      "Automação da irrigação baseada em sensores de umidade do solo e previsão do tempo.",
    created_at: "2026-03-10T08:00:00Z",
  },
  {
    id: 4,
    name: "Qualidade da Água - Rio Paranaíba",
    description:
      "Monitoramento de pH, turbidez e oxigênio dissolvido em pontos estratégicos do rio.",
    created_at: "2026-04-05T16:45:00Z",
  },
];

/**
 * Detalhes de um projeto específico (com dispositivos)
 * Usado na tela de dashboard do projeto
 */
export const mockProjectDetails: Record<string, ProjectDetails> = {
  "1": {
    id: 1,
    name: "Monitoramento de Solo - Fazenda Santa Clara",
    description:
      "Análise contínua de umidade, pH e temperatura do solo para otimização de irrigação em lavoura de café.",
    created_at: "2026-01-15T10:00:00Z",
    devices: [
      { id: 1, name: "Nó Sensor 01", is_online: true },
      { id: 2, name: "Nó Sensor 02", is_online: true },
      { id: 3, name: "Nó Sensor 03", is_online: false },
    ],
  },

  "2": {
    id: 2,
    name: "Estação Meteorológica - Campus UEMG",
    description:
      "Coleta de dados climáticos para correlação com dados de solo e estudos acadêmicos.",
    created_at: "2026-02-20T14:30:00Z",
    devices: [
      { id: 4, name: "Estação Meteo Campus", is_online: true },
    ],
  },

  "3": {
    id: 3,
    name: "Irrigação Inteligente - Horta Comunitária",
    description:
      "Automação da irrigação baseada em sensores de umidade do solo e previsão do tempo.",
    created_at: "2026-03-10T08:00:00Z",
    devices: [
      { id: 5, name: "Sensor Horta 01", is_online: false },
    ],
  },
};

/**
 * Busca um projeto pelo ID
 * TODO: Substituir por chamada real à API
 */
export function getProjectById(id: string): ProjectDetails | null {
  return mockProjectDetails[id] ?? null;
}
