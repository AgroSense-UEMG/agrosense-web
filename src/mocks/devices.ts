/**
 * Dados Mockados - Dispositivos (Inventário)
 * 
 * TODO: Substituir por dados reais da API na Sprint 2
 * Endpoint esperado: GET /api/inventory/
 */

import type { InventoryDevice } from "@/types";

/**
 * Chave de API do coordenador
 * TODO: Buscar da API real (GET /api/auth/api-key/)
 */
export const mockApiKey = "ask_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

/**
 * Lista de dispositivos do inventário
 * Conforme especificação: Modelo, MAC Address, Apelido, Projeto Vinculado, Status
 */
export const mockDevices: InventoryDevice[] = [
  {
    id: "1",
    model: "AgroNode v2.1",
    macAddress: "AA:BB:CC:DD:EE:01",
    alias: "Nó Sensor 01",
    linkedProject: "Monitoramento de Solo - Fazenda Santa Clara",
    status: "online",
  },
  {
    id: "2",
    model: "AgroNode v2.1",
    macAddress: "AA:BB:CC:DD:EE:02",
    alias: "Nó Sensor 02",
    linkedProject: "Monitoramento de Solo - Fazenda Santa Clara",
    status: "online",
  },
  {
    id: "3",
    model: "AgroNode v2.0",
    macAddress: "AA:BB:CC:DD:EE:03",
    alias: "Nó Sensor 03",
    linkedProject: "Monitoramento de Solo - Fazenda Santa Clara",
    status: "offline",
  },
  {
    id: "4",
    model: "AgroWeather Station",
    macAddress: "AA:BB:CC:DD:EE:04",
    alias: "Estação Meteo Campus",
    linkedProject: "Estação Meteorológica - Campus UEMG",
    status: "online",
  },
  {
    id: "5",
    model: "AgroNode v2.1",
    macAddress: "AA:BB:CC:DD:EE:05",
    alias: "Sensor Horta 01",
    linkedProject: "Irrigação Inteligente - Horta Comunitária",
    status: "maintenance",
  },
  {
    id: "6",
    model: "AgroNode v2.1",
    macAddress: "AA:BB:CC:DD:EE:06",
    alias: "",
    linkedProject: null,
    status: "offline",
  },
];

export const mockChartData = [
  { time: "00:00", temperature: 22.5, humidity: 75, ph: 6.1, battery: 82 },
  { time: "02:00", temperature: 21.0, humidity: 78, ph: 6.1, battery: 80 },
  { time: "04:00", temperature: 19.5, humidity: 82, ph: 6.2, battery: 78 },
  { time: "06:00", temperature: 18.2, humidity: 85, ph: 6.2, battery: 77 },
  { time: "08:00", temperature: 20.5, humidity: 76, ph: 6.3, battery: 85 }, // Sol nasceu, bateria sobe
  { time: "10:00", temperature: 24.0, humidity: 65, ph: 6.2, battery: 92 },
  { time: "12:00", temperature: 27.5, humidity: 55, ph: 6.1, battery: 98 },
  { time: "14:00", temperature: 29.8, humidity: 48, ph: 6.0, battery: 100 },
  { time: "16:00", temperature: 28.5, humidity: 52, ph: 6.1, battery: 95 },
  { time: "18:00", temperature: 25.0, humidity: 60, ph: 6.2, battery: 88 },
  { time: "20:00", temperature: 23.5, humidity: 68, ph: 6.2, battery: 85 },
  { time: "22:00", temperature: 22.8, humidity: 72, ph: 6.1, battery: 84 },
];
