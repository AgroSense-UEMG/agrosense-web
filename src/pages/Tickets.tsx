import { listarTickets } from "../services/ticketService"

export default function Tickets(){

  const usuario = localStorage.getItem("usuario")
  const role = localStorage.getItem("role")

  const todosTickets = listarTickets()

  const tickets = role === "admin"
    ? todosTickets
    : todosTickets.filter((ticket: any) => ticket.usuario === usuario)

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8">
        Meus Tickets
      </h1>

      <div className="space-y-4">

        {tickets.map((ticket: any) => <div
          key={ticket.id}
          className="bg-white p-6 rounded-lg shadow"
        >

          <p className="font-semibold">
            Ticket #{ticket.id}
          </p>

          <p>{ticket.mensagem}</p>

          <p className="text-sm text-gray-500 mt-2">
            Status: {ticket.status} | {ticket.data}
          </p>

        </div>)}

      </div>

    </div>
  );

}