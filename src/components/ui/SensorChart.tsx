import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Tipagem para os dados do gráfico
export interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  ph?: number;
  battery?: number;
}

interface SensorChartProps {
  data: ChartDataPoint[];
}

export function SensorChart({ data }: SensorChartProps) {
  return (
    // O contêiner pai precisa ter uma altura definida para o ResponsiveContainer funcionar
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          {/* Grade de fundo */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          
          {/* Eixo X (Horários) */}
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          
          {/* Eixo Y Esquerdo (Temperatura) */}
          <YAxis 
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}ºC`}
          />
          
          {/* Eixo Y Direito (Umidade) */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}%`}
          />
          
          {/* Tooltip ao passar o mouse */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))', 
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {/* Linha de Temperatura (Laranja) */}
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="temperature" 
            name="Temperatura" 
            stroke="#f97316" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          
          {/* Linha de Umidade (Azul) */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="humidity" 
            name="Umidade" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}