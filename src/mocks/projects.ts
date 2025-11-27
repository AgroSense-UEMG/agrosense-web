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
    id: "1",
    title: "Monitoramento de Solo - Fazenda Santa Clara",
    description:
      "Análise contínua de umidade, pH e temperatura do solo para otimização de irrigação em lavoura de café.",
    coordinator: "Dr. Carlos Silva",
    status: "active",
    devicesCount: 12,
  },
  {
    id: "2",
    title: "Estação Meteorológica - Campus UEMG",
    description:
      "Coleta de dados climáticos para pesquisa acadêmica sobre microclimas em áreas urbanas.",
    coordinator: "Dra. Maria Santos",
    status: "active",
    devicesCount: 5,
  },
  {
    id: "3",
    title: "Irrigação Inteligente - Horta Comunitária",
    description:
      "Sistema automatizado de irrigação baseado em sensores de umidade do solo e previsão meteorológica.",
    coordinator: "Prof. João Oliveira",
    status: "active",
    devicesCount: 8,
  },
  {
    id: "4",
    title: "Qualidade da Água - Reservatório Municipal",
    description:
      "Monitoramento de parâmetros de qualidade da água para abastecimento público.",
    coordinator: "Dr. Carlos Silva",
    status: "inactive",
    devicesCount: 3,
  },
];

/**
 * Detalhes de um projeto específico (com dispositivos)
 * Usado na tela de dashboard do projeto
 */
export const mockProjectDetails: Record<string, ProjectDetails> = {
  "1": {
    id: "1",
    title: "Monitoramento de Solo - Fazenda Santa Clara",
    description:
      "Análise contínua de umidade, pH e temperatura do solo para otimização de irrigação em lavoura de café.",
    coordinator: "Dr. Carlos Silva",
    status: "active",
    devicesCount: 3,
    devices: [
      { id: "node-001", name: "Nó Sensor 01", status: "online" },
      { id: "node-002", name: "Nó Sensor 02", status: "online" },
      { id: "node-003", name: "Nó Sensor 03", status: "offline" },
    ],
  },

  "2": {
    id: "2",
    title: "Estação Meteorológica - Campus UEMG",
    description:
      "Coleta de dados climáticos para pesquisa acadêmica sobre microclimas em áreas urbanas.",
    coordinator: "Dra. Maria Santos",
    status: "active",
    devicesCount: 2,
    devices: [
      { id: "node-101", name: "Estação Meteorológica 01", status: "online" },
      { id: "node-102", name: "Estação Meteorológica 02", status: "offline" },
    ],
  },
  
  "3": {
    id: "3",
    title: "Irrigação Inteligente - Horta Comunitária",
    description:
      "Sistema automatizado de irrigação baseado em sensores de umidade do solo e previsão meteorológica.",
    coordinator: "Prof. João Oliveira",
    status: "active",
    devicesCount: 2,
    devices: [
      { id: "node-201", name: "Controlador de Irrigação 01", status: "online" },
      { id: "node-202", name: "Sensor de Umidade 01", status: "online" },
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
