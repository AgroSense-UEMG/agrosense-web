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

export type ProjectStatus = "active" | "inactive";

export interface Project {
  id: string;
  title: string;
  description: string;
  coordinator: string;
  status: ProjectStatus;
  devicesCount: number;
}

export interface ProjectDetails extends Project {
  devices: DeviceNode[];
}

// ============================================================
// Device Types
// ============================================================

export type DeviceStatus = "online" | "offline" | "maintenance";

/**
 * Dispositivo (Nó Sensor) vinculado a um projeto
 * Usado na visualização de projetos
 */
export interface DeviceNode {
  id: string;
  name: string;
  status: Exclude<DeviceStatus, "maintenance">;
}

/**
 * Dispositivo completo do inventário
 * Usado na página de inventário do coordenador
 */
export interface InventoryDevice {
  id: string;
  model: string;
  macAddress: string;
  alias: string;
  linkedProject: string | null;
  status: DeviceStatus;
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
