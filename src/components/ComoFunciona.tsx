export default function ComoFunciona() {
  return (
    <section className="bg-white py-20">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-12">
          Como funciona a plataforma
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📡 Coleta de dados</h3>
            <p className="text-gray-600">
              Sensores ambientais coletam informações como temperatura,
              umidade e condições do solo em tempo real.
            </p>
          </div>

          <div className="p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📊 Visualização</h3>
            <p className="text-gray-600">
              Os dados coletados são organizados em gráficos e dashboards
              para facilitar a análise das informações.
            </p>
          </div>

          <div className="p-6 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">🌱 Apoio à pesquisa</h3>
            <p className="text-gray-600">
              Pesquisadores podem utilizar os dados para estudar
              condições ambientais e melhorar práticas agrícolas.
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}