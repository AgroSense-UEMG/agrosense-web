import Funcionalidades from "../components/Funcionalidades"

export default function Sobre(){
  return(

    <div className="min-h-screen bg-gray-50 py-16 px-6">

      <div className="max-w-4xl mx-auto text-center">

        <h1 className="text-4xl font-bold mb-6">
          Sobre o AgroSense
        </h1>

        <p className="text-gray-600 mb-4">
          O AgroSense é uma plataforma desenvolvida para auxiliar
          pesquisadores no monitoramento de dados ambientais
          coletados por sensores em ambientes agrícolas.
        </p>

        <p className="text-gray-600 mb-10">
          A plataforma permite acompanhar informações em tempo real,
          visualizar dados em gráficos e registrar pesquisas
          relacionadas às condições ambientais.
        </p>

      </div>

      {/* FUNCIONALIDADES APÓS O TEXTO */}
      <Funcionalidades />

    </div>

  )
}