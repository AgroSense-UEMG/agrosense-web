import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Radio, ChevronDown, ChevronUp, 
  Thermometer, Droplets, Activity, Battery, Loader2, UserPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { DeviceNode, ProjectDetails } from "@/types";
import { getProjectDevices } from "@/services/api";
import { mockChartData } from "@/mocks/devices";
import { SensorChart, type ChartDataPoint } from "@/components/ui/SensorChart";
import { SensorCard } from "@/components/ui/SensorCard";
import { toast } from "sonner";
import { MemberList } from "@/components/ui/MemberList";
import { InviteMemberModal } from "@/components/ui/InviteMemberModal";


interface SensorReading extends ChartDataPoint {
  ph?: number;
  battery?: number;
}
interface DeviceButtonProps {
  device: DeviceNode;
  isSelected?: boolean;
  onClick?: () => void;
}

function DeviceButton({ device, isSelected, onClick }: DeviceButtonProps) {
  const isOnline = device.is_online;

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
  selectedDeviceId: number | null;
  onSelectDevice: (deviceId: number) => void;
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
  selectedDeviceId: number | null;
  onSelectDevice: (deviceId: number) => void;
}

function DevicesSectionMobile({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice 
}: DevicesSectionMobileProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const onlineCount = devices.filter((d) => d.is_online).length;

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
  const { projectId } = useParams<{ projectId: string }>();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const rawDeviceId = searchParams.get("device");
  const selectedDeviceId = rawDeviceId !== null ? Number(rawDeviceId) : null;
  const setSelectedDeviceId = (id: number) => setSearchParams({ device: String(id) });

  // Datas via URL (padrão: últimos 7 dias)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

  const startDate = searchParams.get("startDate") || fmtDate(sevenDaysAgo);
  const endDate = searchParams.get("endDate") || fmtDate(today);

  const setStartDate = (date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("startDate", date);
    setSearchParams(params);
  };
  const setEndDate = (date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("endDate", date);
    setSearchParams(params);
  };

  const [deviceData, setDeviceData] = useState<SensorReading[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");

  // Carrega projeto + dispositivos da API
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    async function load() {
      setProjectLoading(true);
      setProjectError("");
      try {
        const token = localStorage.getItem("token") || "";
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

        const res = await fetch(`${apiUrl}/api/projects/${projectId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Projeto não encontrado");
        const proj = await res.json();

        const devices: DeviceNode[] = await getProjectDevices(Number(projectId));

        if (!cancelled) {
          setProject({ ...proj, devices });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setProjectError(err instanceof Error ? err.message : "Erro ao carregar projeto");
        }
      } finally {
        if (!cancelled) setProjectLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [projectId]);

  useEffect(() => {
    if (!selectedDeviceId) return;

    let cancelled = false;

    async function fetchDeviceData() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('access'); 
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        
        const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
        const response = await fetch(`${apiUrl}/api/devices/${selectedDeviceId}/readings/?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!cancelled) {
          if (response.ok) {
            const raw: Array<{ timestamp: string; data: { temperature: number; humidity: number; ph?: number; battery?: number } }> = await response.json();
            const mapped: SensorReading[] = raw.map((item) => ({
              time: new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              temperature: item.data.temperature,
              humidity: item.data.humidity,
              ph: item.data.ph,
              battery: item.data.battery,
            }));
            setDeviceData(mapped);
          } else {
            toast.error("Falha ao carregar sensores");
          }
        }
      } catch {
        if (!cancelled) toast.error("Falha ao carregar sensores");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDeviceData();
    return () => { cancelled = true; };
  }, [projectId, selectedDeviceId, startDate, endDate]);

  // Coordenador: verifica localStorage (mesmo padrão de ProjectsPage)
  const isCoordinator = !!localStorage.getItem("usuarioLogado");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [membersRefreshKey, setMembersRefreshKey] = useState(0);
  const pid = projectId ? Number(projectId) : 0;

  if (projectLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projectError) {
    return <ProjectNotFound />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const selectedDevice = project.devices.find((d) => d.id === selectedDeviceId);

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
                  {project.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:shrink-0">
            <label className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground hidden sm:inline">De</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground hidden sm:inline">Até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </label>
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
                  variant={selectedDevice.is_online ? "default" : "secondary"}
                  className={selectedDevice.is_online ? "bg-primary text-primary-foreground" : ""}
                >
                  {selectedDevice.is_online ? "Online" : "Offline"}
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
                      <p className="text-sm text-muted-foreground">Variação de temperatura e umidade no período selecionado.</p>
                    </CardHeader>
                    <CardContent className="pb-6">
                      {/* Renderização condicional para o Empty State */}
                      {deviceData && deviceData.length > 0 ? (
                        <SensorChart data={deviceData} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/20">
                          <p className="text-muted-foreground text-sm font-medium">
                            Aguardando primeiros dados...
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">
                            Nenhuma leitura registrada para este dispositivo no período.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}


              {pid > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Membros</h3>
                    {isCoordinator && (
                      <Button size="sm" className="gap-2" onClick={() => setInviteOpen(true)}>
                        <UserPlus className="h-4 w-4" />
                        Convidar Membro
                      </Button>
                    )}
                  </div>
                  <MemberList projectId={pid} refreshKey={membersRefreshKey} />
                  <InviteMemberModal
                    projectId={pid}
                    open={inviteOpen}
                    onOpenChange={setInviteOpen}
                    onInvited={() => setMembersRefreshKey((k) => k + 1)}
                  />
                </div>
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