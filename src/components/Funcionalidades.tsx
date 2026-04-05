export default function Funcionalidades() {
  return (
    <section className="bg-gray-100 py-20">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-12">
          Funcionalidades
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              📊 Dashboard interativo
            </h3>

            <p className="text-gray-600">
              Visualize dados coletados pelos sensores em gráficos
              interativos para facilitar a interpretação das informações.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              🔬 Cadastro de pesquisas
            </h3>

            <p className="text-gray-600">
              Pesquisadores podem cadastrar suas pesquisas na plataforma
              e registrar informações importantes sobre seus estudos.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              🌡️ Monitoramento ambiental
            </h3>

            <p className="text-gray-600">
              Acompanhe dados ambientais como temperatura e umidade
              para análise de condições agrícolas.
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}