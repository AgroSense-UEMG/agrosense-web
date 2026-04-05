import { Link } from "react-router-dom"

export default function CTA(){
  return(

    <section className="py-10 text-center bg-green-700 text-white">

      <h2 className="text-3xl font-bold mb-4">
        Comece sua pesquisa agora
      </h2>

      <p className="mb-6 text-green-100">
        Cadastre sensores e acompanhe dados ambientais em tempo real.
      </p>

      <Link
        to="/pesquisa"
        className="bg-white text-green-700 px-6 py-3 rounded font-semibold hover:bg-gray-100"
      >
        Cadastrar Pesquisa
      </Link>

    </section>

  )
}