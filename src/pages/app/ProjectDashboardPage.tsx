import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Download, Radio, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { DeviceNode, ProjectDetails } from "@/types";
import { getProjectById } from "@/mocks";

/**
 * Componente de botão de dispositivo reutilizável
 */
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

/**
 * Sidebar de dispositivos - Desktop
 */
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

/**
 * Seção de dispositivos - Mobile (Colapsável)
 */
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
      {/* Header colapsável */}
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

      {/* Lista de dispositivos (expandida) */}
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
                  onClick={() => {
                    onSelectDevice(device.id);
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Fallback para quando o projeto não é encontrado
 */
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

/**
 * Página de Dashboard Dinâmico de um Projeto
 * Rota: /app/projects/:projectId
 * 
 * Conforme especificação:
 * - Header: Nome do Projeto, Seletor de Data (Date Range Picker), Botão "Exportar CSV"
 * - Sidebar/Menu do Projeto: Lista de Dispositivos (Nós) vinculados a este projeto
 * - Área de Dados: Renderização dinâmica baseada no manifesto JSON
 * 
 * TODO (Dupla C - Sprint 3):
 * - Implementar lógica de leitura do manifesto JSON
 * - Renderizar Cards de Sensor dinamicamente
 * - Implementar gráficos com Recharts/Chart.js
 * - Implementar Date Range Picker
 * - Implementar exportação CSV
 */
export function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // TODO: Substituir por chamada real à API
  const project: ProjectDetails | null = projectId 
    ? getProjectById(projectId) 
    : null;

  // Projeto não encontrado
  if (!project) {
    return <ProjectNotFound />;
  }

  const selectedDevice = project.devices.find((d) => d.id === selectedDeviceId);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
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
            {/* TODO: Implementar Date Range Picker (Sprint 3) */}
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

      {/* Dispositivos - Mobile (aparece apenas em telas menores que lg) */}
      <DevicesSectionMobile
        devices={project.devices}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
      />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de Dispositivos - Desktop */}
        <DevicesSidebarDesktop
          devices={project.devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={setSelectedDeviceId}
        />

        {/* Área Principal de Dados */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {selectedDevice ? (
            /* Dispositivo selecionado - mostrar dados */
            <Card className="h-full min-h-[300px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {selectedDevice.name}
                  </CardTitle>
                  <Badge
                    variant={selectedDevice.status === "online" ? "default" : "secondary"}
                    className={
                      selectedDevice.status === "online"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    {selectedDevice.status === "online" ? "Online" : "Offline"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dados do sensor serão exibidos aqui.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Device ID: {selectedDevice.id}
                </p>
                {/* 
                  TODO (Dupla C - Sprint 3):
                  Implementar Cards de Sensor e gráficos aqui
                */}
              </CardContent>
            </Card>
          ) : (
            /* Estado Vazio - Nenhum dispositivo selecionado */
            <Card className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">
                  Selecione um dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground max-w-md">
                  {project.devices.length > 0
                    ? "Clique em um dos dispositivos para visualizar os dados dos sensores em tempo real."
                    : "Este projeto ainda não possui dispositivos vinculados."
                  }
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Project ID: {projectId}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
