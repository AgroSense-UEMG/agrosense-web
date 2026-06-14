/**
 * Tipos centralizados da aplicação AgroSense
 * 
 * Mantém todas as interfaces e tipos em um único lugar para:
 * - Evitar duplicação de código
 * - Facilitar manutenção
 * - Garantir consistência entre componentes
 */

// ============================================================
// User Types
// ============================================================

export type UserRole = "Coordenador" | "Pesquisador";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// ============================================================
// Project Types
// ============================================================

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface ProjectDetails extends Project {
  devices: DeviceNode[];
}

// ============================================================
// Device Types
// ============================================================

/**
 * Dispositivo (Nó Sensor) vinculado a um projeto
 * Usado na visualização de projetos
 */
export interface DeviceNode {
  id: number;
  name: string;
  is_online: boolean;
}

/**
 * Dispositivo completo do inventário
 * Usado na página de inventário do coordenador
 * Formato real da API: GET /api/devices/
 */
export interface Device {
  id: number;
  name: string;
  project: number | null;
  is_online: boolean;
  created_at: string;
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Se true, apenas coordenadores podem ver este item */
  coordinatorOnly?: boolean;
}

// ============================================================
// Member Types
// ============================================================

export type MemberRole = "Coordenador" | "Pesquisador";

export interface Member {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
}
