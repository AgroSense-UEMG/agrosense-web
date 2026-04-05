export interface EstatisticasData {
  pesquisasAtivas: number | string;
  nosCadastrados: number | string;
}

export interface ComponenteDispositivo {
  id_componente: string;
  tipo: "sensor" | "atuador";
  nome_exibicao: string;
  unidade_medida?: string;
  comandos_possiveis?: string[];
}

export interface Manifesto {
  id_dispositivo: string;
  nome_produto: string;
  fabricante: string;
  componentes: ComponenteDispositivo[];
}