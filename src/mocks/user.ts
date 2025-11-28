/**
 * Dados Mockados - Usuário
 * 
 * TODO: Substituir por dados reais da API após integração (Sprint 2)
 * Endpoint esperado: GET /api/auth/me/
 */

import type { User } from "@/types";

export const mockUser: User = {
  id: "1",
  name: "Dr. Carlos Silva",
  email: "carlos.silva@uemg.br",
  role: "Coordenador",
  avatarUrl: "",
};

/**
 * Helper para verificar se o usuário é coordenador
 * TODO: Substituir por verificação real após integração com autenticação
 */
export function isUserCoordinator(user: User): boolean {
  return user.role === "Coordenador";
}
