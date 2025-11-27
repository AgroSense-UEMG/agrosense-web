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
