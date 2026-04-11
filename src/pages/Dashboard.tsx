import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

import {
  getDispositivoById,
  getSensoresByPeriodo
} from "../services/api";

interface Componente {
  id_componente: string;
  tipo: "sensor" | "atuador";
  nome_exibicao: string;
  unidade_medida?: string;
}

interface Manifesto {
  id_dispositivo: string;
  nome_produto: string;
  componentes: Componente[];
}

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [manifesto, setManifesto] = useState<Manifesto | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
  const [valoresAtuais, setValoresAtuais] = useState<Record<string, number>>({});
  const [valoresAnteriores, setValoresAnteriores] = useState<Record<string, number>>({});
  const [statusAtuadores, setStatusAtuadores] = useState<Record<string, boolean>>({});

  const [loadingDados, setLoadingDados] = useState(true);
  const [loadingManifesto, setLoadingManifesto] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchManifesto = useCallback(async () => {
    try {
      const data = await getDispositivoById(id || "1");
      setManifesto(data.manifesto);
    } catch {
      toast.error("Erro ao carregar dispositivo");
    } finally {
      setLoadingManifesto(false);
    }
  }, [id]);

  const fetchDados = useCallback(async () => {
    setLoadingDados(true);

    try {
      const data = await getSensoresByPeriodo(startDate, endDate);

      setDadosGrafico(data);

      if (data.length > 0) {
        const atual = data[data.length - 1];
        const anterior = data[data.length - 2] || {};

        setValoresAtuais(atual);
        setValoresAnteriores(anterior);
      }

    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoadingDados(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchManifesto();
  }, [fetchManifesto]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const handleExportarCSV = () => {
    if (!dadosGrafico.length) {
      toast.warn("Sem dados");
      return;
    }

    const headers = Object.keys(dadosGrafico[0]).join(",");
    const rows = dadosGrafico.map(d => Object.values(d).join(",")).join("\n");

    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `dados_${id}.csv`;
    link.click();
  };

  const sensores = manifesto?.componentes.filter(c => c.tipo === "sensor") || [];
  const atuadores = manifesto?.componentes.filter(c => c.tipo === "atuador") || [];

  const getTrend = (atual: number, anterior: number) => {
    if (anterior === undefined) return "neutral";
    if (atual > anterior) return "up";
    if (atual < anterior) return "down";
    return "neutral";
  };

  if (loadingDados || loadingManifesto) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>

          <div className="grid md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>

          <div className="h-[400px] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-3xl font-black text-gray-800">
            {manifesto?.nome_produto}
          </h1>

          <div className="flex gap-2 flex-wrap">
            <input type="date" onChange={(e) => setStartDate(e.target.value)} className="border px-2 py-1 rounded"/>
            <input type="date" onChange={(e) => setEndDate(e.target.value)} className="border px-2 py-1 rounded"/>

            <button onClick={fetchDados} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
              Filtrar
            </button>

            <button onClick={handleExportarCSV} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
              CSV
            </button>

            <button onClick={() => navigate("/")} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Voltar
            </button>
          </div>
        </div>

        {/* CARDS PREMIUM */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {sensores.map(sensor => {
            const atual = valoresAtuais[sensor.id_componente];
            const anterior = valoresAnteriores[sensor.id_componente];
            const trend = getTrend(atual, anterior);

            return (
              <div key={sensor.id_componente} className="bg-white p-6 rounded-2xl shadow border-t-4 border-green-500">
                <h3 className="text-xs text-gray-400 uppercase">{sensor.nome_exibicao}</h3>

                <div className="text-3xl font-bold mt-2">
                  {atual ?? "--"} {sensor.unidade_medida}
                </div>

                <div className={`text-sm mt-2 ${
                  trend === "up" ? "text-green-600" :
                  trend === "down" ? "text-red-500" :
                  "text-gray-400"
                }`}>
                  {trend === "up" && "↑ Subindo"}
                  {trend === "down" && "↓ Caindo"}
                  {trend === "neutral" && "— Estável"}
                </div>
              </div>
            );
          })}
        </div>

        {/* GRÁFICO PREMIUM */}
        <div className="bg-white p-6 rounded-2xl shadow h-[400px]">
          {dadosGrafico.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Nenhum dado disponível
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosGrafico}>
                <defs>
                  {sensores.map((s, i) => (
                    <linearGradient key={s.id_componente} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`hsl(${i * 60},70%,50%)`} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={`hsl(${i * 60},70%,50%)`} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />

                {sensores.map((sensor, index) => (
                  <Area
                    key={sensor.id_componente}
                    type="monotone"
                    dataKey={sensor.id_componente}
                    stroke={`hsl(${index * 60},70%,50%)`}
                    fill={`url(#color${index})`}
                    strokeWidth={3}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}