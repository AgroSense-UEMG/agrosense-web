import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Download, Radio, ChevronDown, ChevronUp, 
  Thermometer, Droplets, Activity, Battery, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { DeviceNode, ProjectDetails } from "@/types";
import { getProjectById } from "@/mocks";
import { mockChartData } from "@/mocks/devices";
import { SensorChart } from "@/components/ui/SensorChart";
import { SensorCard } from "@/components/ui/SensorCard";
import { toast } from "sonner"; // Importação do Toast para feedback visual de erro

interface DeviceButtonProps {
  device: DeviceNode;
  isSelected?: boolean;
  onClick?: () => void;
}

function DeviceButton({ device, isSelected, onClick }: DeviceButtonProps) {
  const isOnline = device.status === "online";

  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      className={cn(
        "justify-start gap-2 h-auto py-2.5 w-full",
        isSelected && "bg-accent"
      )}
      onClick={onClick}
    >
      <Radio
        className={cn(
          "h-4 w-4 shrink-0",
          isOnline ? "text-primary" : "text-muted-foreground"
        )}
      />
      <div className="flex flex-col items-start min-w-0">
        <span className="text-sm font-medium truncate">{device.name}</span>
        <span
          className={cn(
            "text-xs",
            isOnline ? "text-primary" : "text-muted-foreground"
          )}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </Button>
  );
}

interface DevicesSidebarDesktopProps {
  devices: DeviceNode[];
  selectedDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
}

function DevicesSidebarDesktop({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice 
}: DevicesSidebarDesktopProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-foreground">
          Dispositivos
        </h2>
        <p className="text-xs text-muted-foreground">
          Selecione um nó para ver os dados
        </p>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          {devices.map((device) => (
            <DeviceButton
              key={device.id}
              device={device}
              isSelected={selectedDeviceId === device.id}
              onClick={() => onSelectDevice(device.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

interface DevicesSectionMobileProps {
  devices: DeviceNode[];
  selectedDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
}

function DevicesSectionMobile({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice 
}: DevicesSectionMobileProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const onlineCount = devices.filter((d) => d.status === "online").length;

  return (
    <div className="border-b border-border bg-card lg:hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
      >
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Dispositivos
          </h2>
          <p className="text-xs text-muted-foreground">
            {selectedDevice 
              ? `Selecionado: ${selectedDevice.name}` 
              : `${onlineCount} de ${devices.length} online`
            }
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <>
          <Separator />
          <div className="p-2 max-h-48 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {devices.map((device) => (
                <DeviceButton
                  key={device.id}
                  device={device}
                  isSelected={selectedDeviceId === device.id}
                  onClick={() => onSelectDevice(device.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProjectNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Projeto não encontrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            O projeto que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/app/projects">Voltar para projetos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProjectDashboardPage() {
  // 1. FONTE DA VERDADE NA URL: Captura do projectId por parâmetro de rota
  const { projectId } = useParams<{ projectId: string }>();
  
  // 2. FONTE DA VERDADE NA URL: Captura do deviceId por Query Params (?device=id) para evitar estado fantasma
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDeviceId = searchParams.get("device");
  const setSelectedDeviceId = (id: string) => setSearchParams({ device: id });

  // ESTADOS RESTANTES da página (Dados e Carregamento)
  const [deviceData, setDeviceData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // BUSCA NO MOCK USANDO O ID DA URL
  const project: ProjectDetails | null = projectId 
    ? getProjectById(projectId) 
    : null;

  // EFEITO COLATERAL: Escuta as mudanças da URL (projectId e selectedDeviceId)
  useEffect(() => {
    if (!selectedDeviceId) return;

    async function fetchDeviceData() {
      setIsLoading(false); // Reseta estado caso haja requisição anterior pendente
      setIsLoading(true);
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('access'); 
        
        // Correção 1: Utilizando a variável de ambiente VITE_API_URL
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        
        // Correção 4: Atualizado para o endpoint oficial de readings
        const response = await fetch(`${apiUrl}/api/v1/devices/${selectedDeviceId}/readings/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDeviceData(data); // Salva a lista (array) completa enviada pela API
        } else {
          // Correção 3: Feedback visual com Toast ao invés de console.error
          toast.error("Falha ao carregar sensores");
        }
      } catch (error) {
        // Correção 3: Feedback visual com Toast ao invés de console.error
        toast.error("Falha ao carregar sensores");
      } finally {
        setIsLoading(false); 
      }
    }

    fetchDeviceData();
  }, [projectId, selectedDeviceId]); // Dependências corrigidas para escutar a URL diretamente

  if (!project) {
    return <ProjectNotFound />;
  }

  const selectedDevice = project.devices.find((d) => d.id === selectedDeviceId);

  // Correção 4: Captura o primeiro índice [0] do array de histórico para exibir as métricas em tempo real nos cards
  const latestReading = deviceData && deviceData.length > 0 ? deviceData[0] : null;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <Button variant="ghost" size="icon" className="shrink-0 -ml-2 sm:ml-0" asChild>
              <Link to="/app/projects">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar para projetos</span>
              </Link>
            </Button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-[hsl(var(--title-primary))] sm:text-xl lg:text-2xl line-clamp-1">
                  {project.title}
                </h1>
                <Badge
                  variant={project.status === "active" ? "default" : "secondary"}
                  className={cn(
                    "shrink-0",
                    project.status === "active" && "bg-primary text-primary-foreground"
                  )}
                >
                  {project.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Coordenador: {project.coordinator}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:shrink-0">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden xs:inline sm:hidden md:inline">Últimos 7 dias</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline sm:hidden md:inline">Exportar</span>
            </Button>
          </div>
        </div>
      </div>

      <DevicesSectionMobile
        devices={project.devices}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
      />

      <div className="flex flex-1 overflow-hidden">
        <DevicesSidebarDesktop
          devices={project.devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={setSelectedDeviceId}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-muted/20">
          {selectedDevice ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedDevice.name}</h2>
                  <p className="text-sm text-muted-foreground">ID: {selectedDevice.id}</p>
                </div>
                <Badge
                  variant={selectedDevice.status === "online" ? "default" : "secondary"}
                  className={selectedDevice.status === "online" ? "bg-primary text-primary-foreground" : ""}
                >
                  {selectedDevice.status === "online" ? "Online" : "Offline"}
                </Badge>
              </div>

              {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SensorCard
                      title="Temperatura do Solo"
                      value={latestReading?.temperature ? `${latestReading.temperature}°C` : "--"}
                      icon={Thermometer}
                      iconColor="text-orange-500"
                      trendText="Atualizado agora"
                      chartData={mockChartData}
                      dataKey="temperature"
                      chartColor="#f97316"
                    />

                    <SensorCard
                      title="Umidade"
                      value={latestReading?.humidity ? `${latestReading.humidity}%` : "--"}
                      icon={Droplets}
                      iconColor="text-blue-500"
                      trendText="Atualizado agora"
                      chartData={mockChartData}
                      dataKey="humidity"
                      chartColor="#3b82f6"
                    />

                    <SensorCard
                      title="Nível de pH"
                      value={latestReading?.ph ? latestReading.ph : "--"}
                      icon={Activity}
                      iconColor="text-purple-500"
                      trendText="Atualizado agora"
                      chartData={mockChartData}
                      dataKey="ph"
                      chartColor="#a855f7"
                    />

                    <SensorCard
                      title="Bateria do Nó"
                      value={latestReading?.battery ? `${latestReading.battery}%` : "--"}
                      icon={Battery}
                      iconColor="text-green-500"
                      trendText="Atualizado agora"
                      chartData={mockChartData}
                      dataKey="battery"
                      chartColor="#22c55e"
                    />
                  </div>

                  <Card className="min-h-[350px]">
                    <CardHeader>
                      <CardTitle>Histórico de Leituras</CardTitle>
                      <p className="text-sm text-muted-foreground">Variação de temperatura e umidade nas últimas 24h.</p>
                    </CardHeader>
                    <CardContent className="pb-6">
                      {/* Passa a lista completa (array) de leituras reais obtidas para renderizar no gráfico */}
                      <SensorChart data={(deviceData && deviceData.length > 0) ? deviceData : mockChartData} />
                    </CardContent>
                  </Card>
                </>
              )}

            </div>
          ) : (
            <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Radio className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Selecione um dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {project.devices.length > 0
                    ? "Escolha um dispositivo no menu lateral para visualizar as leituras dos sensores em tempo real."
                    : "Este projeto ainda não possui dispositivos vinculados."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}