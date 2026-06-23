import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SensorCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trendText?: string;
  chartData: Record<string, unknown>[]; // 👈 A mágica contra o "any" acontece aqui
  dataKey: string;
  chartColor?: string;
}

export function SensorCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-muted-foreground",
  trendText,
  chartData,
  dataKey,
  chartColor = "#2563eb", // Azul padrão
}: SensorCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="text-2xl font-bold">{value}</div>
        {trendText && (
          <p className="text-xs text-muted-foreground mb-2">{trendText}</p>
        )}
        
        {/* Mini Gráfico (Sparkline) */}
        <div className="h-[60px] w-full mt-2 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              {/* YAxis oculto apenas para dar um respiro nos limites do gráfico */}
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2}
                dot={false} // Remove as bolinhas para ficar um visual mais limpo
                isAnimationActive={false} // Opcional: remove animação para renderizar mais rápido
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}