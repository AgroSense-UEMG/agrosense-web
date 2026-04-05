import { useEffect, useState } from "react"

interface Stats {
  total_pesquisas: number
  total_nos: number
}

export default function Estatisticas() {
  const [stats, setStats] = useState<Stats>({
    total_pesquisas: 0,
    total_nos: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() =>
        setStats({
          total_pesquisas: 0,
          total_nos: 0,
        })
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="py-12 text-center">
      <h2 className="text-2xl font-bold mb-6 text-green-800">
        Impacto do AgroSense
      </h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="flex justify-center gap-10">
          <div>
            <p className="text-3xl font-bold text-green-700">
              {stats.total_pesquisas}
            </p>
            <p>Pesquisas</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-green-700">
              {stats.total_nos}
            </p>
            <p>Dispositivos</p>
          </div>
        </div>
      )}
    </div>
  )
}