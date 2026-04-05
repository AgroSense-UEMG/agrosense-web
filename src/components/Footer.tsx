import { Link } from "react-router-dom"

export default function Footer(){

  return(

    <footer className="bg-gray-900 text-white py-3 relative">

      {/* Conteúdo central */}
      <div className="text-center">

        <h2 className="text-lg font-semibold">
          AgroSence 2026
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          plataforma de monitoramento para pesquisas agrícolas
        </p>

      </div>

      {/* Botão contato no canto direito */}
      <div className="absolute right-6 bottom-6">

        <Link
          to="/contato"
          className="text-green-400 hover:text-green-300 font-medium"
        >
          Contato
        </Link>

      </div>

    </footer>

  )

}