import { useState } from "react"
import { toast } from "react-toastify"
import { criarTicket } from "../../../services/ticketService";

export default function Contato(){

  const [mensagem, setMensagem] = useState("")

  function enviarMensagem(e: React.FormEvent){
    e.preventDefault()

    const usuario = localStorage.getItem("user") || "" 

    if (!mensagem.trim()) {
      toast.error("Por favor, descreva sua dúvida.")
      return
    }

    criarTicket(usuario, mensagem)

    toast.success("Ticket enviado com sucesso!")
    setMensagem("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
          Está com algum problema?
        </h2>

        <form onSubmit={enviarMensagem}>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="Descreva sua dúvida..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          <button
            type="submit"
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Enviar dúvida
          </button>
        </form>
      </div>
    </div>
  );
}