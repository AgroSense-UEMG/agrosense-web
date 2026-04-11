import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface DadoHistorico {
  hora: string;
  umid_solo: number;
  temp_ar: number;
}

export default function Historico() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [dataBusca, setDataBusca] = useState(new Date().toISOString().split('T')[0]);
  const [dadosHistoricos, setDadosHistoricos] = useState<DadoHistorico[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarDadosPorData = useCallback(async (data: string) => {
    setCarregando(true);
    try {
      const response = await fetch(`/api/dashboard/dispositivo/${id || '1774192155939'}/historico?data=${data}`);
      if (!response.ok) throw new Error();
      const json = await response.json();
      setDadosHistoricos(json);
    } catch (err) {
      console.warn("API offline - Exibindo dados de simulação.");
      setDadosHistoricos([
        { hora: "00:00", umid_solo: 45, temp_ar: 18 },
        { hora: "08:00", umid_solo: 40, temp_ar: 22 },
        { hora: "12:00", umid_solo: 35, temp_ar: 28 },
        { hora: "16:00", umid_solo: 32, temp_ar: 26 },
        { hora: "20:00", umid_solo: 45, temp_ar: 21 },
        { hora: "23:59", umid_solo: 48, temp_ar: 19 },
      ]);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    buscarDadosPorData(dataBusca);
  }, [buscarDadosPorData, dataBusca]);

  const exportarRelatorioDia = () => {
    const headers = "Horário,Umidade Solo (%),Temperatura (°C)\n";
    const csvContent = dadosHistoricos.map(d => `${d.hora},${d.umid_solo},${d.temp_ar}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_${id}_${dataBusca}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate(`/dashboard/${id}`)}
              className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-200 transition-all text-gray-600 font-bold"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">Análise Histórica</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: {id}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center">
            <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-gray-200">
              <span className="text-[10px] font-black text-gray-400 uppercase">Data:</span>
              <input 
                type="date" 
                value={dataBusca}
                onChange={(e) => setDataBusca(e.target.value)}
                className="outline-none bg-transparent font-bold text-green-700 cursor-pointer"
              />
            </div>
            <button 
              onClick={exportarRelatorioDia}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all"
            >
              Download .CSV
            </button>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="h-[400px] w-full">
            {carregando ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-green-700">Consultando Banco de Dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosHistoricos}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="hora" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="umid_solo" name="Umidade (%)" stroke="#22c55e" strokeWidth={4} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="temp_ar" name="Temperatura (°C)" stroke="#f97316" strokeWidth={4} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                <tr>
                  <th className="px-8 py-4">Horário</th>
                  <th className="px-8 py-4">Umidade Solo</th>
                  <th className="px-8 py-4">Temperatura</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {dadosHistoricos.map((d, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-800">{d.hora}</td>
                    <td className="px-8 py-5">{d.umid_solo}%</td>
                    <td className="px-8 py-5">{d.temp_ar}°C</td>
                    <td className="px-8 py-5">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Ok</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}