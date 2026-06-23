/**
 * Dados Mockados - Dispositivos (Inventário)
 *
 * TODO: Substituir por dados reais da API na Sprint 2
 * Endpoint esperado: GET /api/devices/
 */

import type { Device } from "@/types";

/**
 * Chave de API do coordenador
 * TODO: Buscar da API real (GET /api/auth/api-key/)
 */
export const mockApiKey = "ask_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

/**
 * Lista de dispositivos do inventário
 */
export const mockDevices: Device[] = [
  {
    id: 1,
    name: "Nó Sensor 01",
    project: 1,
    is_online: true,
    last_seen: "2026-06-22T10:00:00Z",
    created_at: "2026-01-20T08:00:00Z",
  },
  {
    id: 2,
    name: "Nó Sensor 02",
    project: 1,
    is_online: true,
    last_seen: "2026-06-22T09:30:00Z",
    created_at: "2026-01-20T08:00:00Z",
  },
  {
    id: 3,
    name: "Nó Sensor 03",
    project: 1,
    is_online: false,
    last_seen: null,
    created_at: "2026-01-20T08:00:00Z",
  },
  {
    id: 4,
    name: "Estação Meteo Campus",
    project: 2,
    is_online: true,
    last_seen: "2026-06-22T09:30:00Z",
    created_at: "2026-02-25T10:00:00Z",
  },
  {
    id: 5,
    name: "Sensor Horta 01",
    project: 3,
    is_online: false,
    last_seen: null,
    created_at: "2026-03-12T14:00:00Z",
  },
  {
    id: 6,
    name: "",
    project: null,
    is_online: false,
    last_seen: null,
    created_at: "2026-04-01T09:00:00Z",
  },
];

export const mockChartData = [
  { time: "00:00", temperature: 22.5, humidity: 75, ph: 6.1, battery: 82 },
  { time: "02:00", temperature: 21.0, humidity: 78, ph: 6.1, battery: 80 },
  { time: "04:00", temperature: 19.5, humidity: 82, ph: 6.2, battery: 78 },
  { time: "06:00", temperature: 18.2, humidity: 85, ph: 6.2, battery: 77 },
  { time: "08:00", temperature: 20.5, humidity: 76, ph: 6.3, battery: 85 },
  { time: "10:00", temperature: 24.0, humidity: 65, ph: 6.2, battery: 92 },
  { time: "12:00", temperature: 27.5, humidity: 55, ph: 6.1, battery: 98 },
  { time: "14:00", temperature: 29.8, humidity: 48, ph: 6.0, battery: 100 },
  { time: "16:00", temperature: 28.5, humidity: 52, ph: 6.1, battery: 95 },
  { time: "18:00", temperature: 25.0, humidity: 60, ph: 6.2, battery: 88 },
  { time: "20:00", temperature: 23.5, humidity: 68, ph: 6.2, battery: 85 },
  { time: "22:00", temperature: 22.8, humidity: 72, ph: 6.1, battery: 84 },
];
