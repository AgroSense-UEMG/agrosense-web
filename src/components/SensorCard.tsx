interface SensorCardProps {
  title: string;
  value: number | string | undefined;
  unit?: string;
}

export default function SensorCard({
  title,
  value,
  unit
}: SensorCardProps) {
  const isEmpty = value === undefined || value === null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500 hover:shadow-md transition-all">
      
      {/* Título */}
      <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
        {title}
      </h3>

      {/* Valor */}
      <div className="mt-2 flex items-end gap-1">
        <span className="text-4xl font-black text-gray-800">
          {isEmpty ? "--" : value}
        </span>

        {unit && (
          <span className="text-sm text-gray-400 font-medium mb-1">
            {unit}
          </span>
        )}
      </div>

      {/* Status */}
      <div className="mt-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-400">Atualizando</span>
      </div>

    </div>
  );
}