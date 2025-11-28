import { useState } from "react";
import { Copy, Check, Pencil, MoreHorizontal, Key, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { InventoryDevice, DeviceStatus } from "@/types";
import { mockApiKey, mockDevices } from "@/mocks";

/**
 * Configuração de cores e labels para status de dispositivos
 */
const STATUS_CONFIG: Record<DeviceStatus, { label: string; className: string }> = {
  online: {
    label: "Online",
    className: "bg-primary text-primary-foreground",
  },
  offline: {
    label: "Offline",
    className: "bg-muted/80 text-foreground",
  },
  maintenance: {
    label: "Manutenção",
    className: "bg-yellow-500 text-white",
  },
};

/**
 * Badge de status com cores apropriadas
 */
function StatusBadge({ status }: { status: DeviceStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}

/**
 * Componente de Chave de API com funcionalidade de copiar
 */
function ApiKeyDisplay() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            Minha Chave de API
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-muted/20 px-3 py-2 font-mono text-sm text-foreground overflow-hidden text-ellipsis">
            {mockApiKey.slice(0, 12)}...{mockApiKey.slice(-4)}
          </code>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copiar chave de API</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {copied ? "Copiado!" : "Copiar chave"}
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Use esta chave para autenticar seus dispositivos IoT com a plataforma.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Ações comuns para dispositivos
 */
interface DeviceActionsProps {
  device: InventoryDevice;
}

function DeviceActions({ device }: DeviceActionsProps) {
  const handleEditAlias = () => {
    // TODO: Implementar modal de edição de apelido (Sprint 2)
    console.log("Editar apelido:", device.id);
  };

  const handleChangeProject = () => {
    // TODO: Implementar dropdown de mudança de projeto (Sprint 2)
    console.log("Mudar projeto:", device.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEditAlias}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar Apelido
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleChangeProject}>
          Vincular a Projeto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Linha da tabela de dispositivos - Desktop
 */
function DeviceRow({ device }: { device: InventoryDevice }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{device.model}</TableCell>
      <TableCell>
        <code className="rounded bg-muted/20 px-2 py-1 text-xs font-mono">
          {device.macAddress}
        </code>
      </TableCell>
      <TableCell>
        {device.alias || (
          <span className="text-muted-foreground italic">Sem apelido</span>
        )}
      </TableCell>
      <TableCell className="max-w-[200px]">
        {device.linkedProject ? (
          <span className="line-clamp-1">{device.linkedProject}</span>
        ) : (
          <span className="text-muted-foreground italic">Não vinculado</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge status={device.status} />
      </TableCell>
      <TableCell className="text-right">
        <DeviceActions device={device} />
      </TableCell>
    </TableRow>
  );
}

/**
 * Card de dispositivo - Mobile
 * Exibe informações em formato de card para melhor visualização em telas pequenas
 */
function DeviceCard({ device }: { device: InventoryDevice }) {
  const isOnline = device.status === "online";

  return (
    <Card className="relative">
      <CardContent className="p-4">
        {/* Header do card */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Radio
              className={cn(
                "h-4 w-4 shrink-0",
                isOnline ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className="font-medium truncate">
              {device.alias || device.model}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <StatusBadge status={device.status} />
            <DeviceActions device={device} />
          </div>
        </div>

        {/* Informações do dispositivo */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Modelo:</span>
            <span className="font-medium">{device.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">MAC:</span>
            <code className="rounded bg-muted/20 px-1.5 py-0.5 text-xs font-mono">
              {device.macAddress}
            </code>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground shrink-0">Projeto:</span>
            <span className="text-right truncate">
              {device.linkedProject || (
                <span className="text-muted-foreground italic">Não vinculado</span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Estado vazio quando não há dispositivos
 */
function EmptyDevicesState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Radio className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-foreground font-medium">
        Nenhum dispositivo registrado
      </p>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Use sua chave de API para conectar dispositivos IoT à plataforma.
      </p>
    </div>
  );
}

/**
 * Página de Inventário de Dispositivos
 * Rota: /app/inventory (Apenas Coordenador)
 * 
 * Conforme especificação:
 * - Header: Mostrar "Minha Chave de API" (campo com botão de copiar)
 * - Tabela/Lista: Listar dispositivos reivindicados
 *   - Colunas: Modelo, MAC Address (ID), Apelido (Editável), Projeto Vinculado (Dropdown), Status
 * - Ações: Botão "Editar Apelido" (Modal), Dropdown para mudar o Projeto Vinculado
 * 
 * Responsividade:
 * - Desktop (md+): Tabela tradicional
 * - Mobile: Cards empilhados
 */
export function InventoryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--title-primary))] sm:text-3xl">
          Inventário de Dispositivos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie seus dispositivos IoT e vincule-os aos seus projetos
        </p>
      </div>

      {/* API Key Section */}
      <div className="mb-6 sm:mb-8 max-w-xl">
        <ApiKeyDisplay />
      </div>

      {/* Devices Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Dispositivos Registrados</CardTitle>
            <span className="text-sm text-muted-foreground">
              {mockDevices.length} dispositivo{mockDevices.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {mockDevices.length > 0 ? (
            <>
              {/* Tabela - Desktop (md+) */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modelo</TableHead>
                      <TableHead>MAC Address</TableHead>
                      <TableHead>Apelido</TableHead>
                      <TableHead>Projeto Vinculado</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDevices.map((device) => (
                      <DeviceRow key={device.id} device={device} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Cards - Mobile (abaixo de md) */}
              <div className="md:hidden p-4 pt-0 space-y-3">
                {mockDevices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </>
          ) : (
            <EmptyDevicesState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
