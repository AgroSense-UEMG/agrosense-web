export interface Ticket {
  id: number;
  usuario: string;
  mensagem: string;
  status: "Aberto" | "Em Andamento" | "Resolvido";
  data: string;
}

export function criarTicket(usuario: string, mensagem: string): void {
  const dadosLocais = localStorage.getItem("tickets");
  
  const listaTickets: Ticket[] = dadosLocais ? JSON.parse(dadosLocais) : [];

  const novoTicket: Ticket = {
    id: Date.now(),
    usuario,
    mensagem,
    status: "Aberto",
    data: new Date().toLocaleDateString("pt-BR")
  };

  listaTickets.push(novoTicket);

  localStorage.setItem("tickets", JSON.stringify(listaTickets));
}

export function listarTickets(): Ticket[] {
  const dadosLocais = localStorage.getItem("tickets");
  
  if (!dadosLocais) return [];
  
  try {
    return JSON.parse(dadosLocais) as Ticket[];
  } catch (error) {
    console.error("Erro ao ler tickets:", error);
    return [];
  }
}