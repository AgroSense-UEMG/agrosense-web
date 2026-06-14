import { useState, useEffect, useCallback } from "react";
import { Copy, Check, MoreHorizontal, Key, Radio, Loader2, Pencil } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Device } from "@/types";
import { getDevices } from "@/services/api";
import { EditAliasModal } from "@/components/ui/EditAliasModal";
import { LinkProjectDropdown } from "@/components/ui/LinkProjectDropdown";

const API_KEY_FALLBACK = "ask_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

/**
 * Badge de status baseado no booleano is_online
 */
function StatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={isOnline ? "bg-primary text-primary-foreground" : "bg-muted/80 text-foreground"}
    >
      {isOnline ? "Online" : "Offline"}
    </Badge>
  );
}

/**
 * Componente de Chave de API com funcionalidade de copiar
 */
function ApiKeyDisplay() {
  const [copied, setCopied] = useState(false);

  const apiKey = API_KEY_FALLBACK;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">Minha Chave de API</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-muted/20 px-3 py-2 font-mono text-sm text-foreground overflow-hidden text-ellipsis">
            {apiKey.slice(0, 12)}...{apiKey.slice(-4)}
          </code>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copiar chave de API</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copiado!" : "Copiar chave"}</TooltipContent>
          </Tooltip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Use esta chave para autenticar seus dispositivos IoT com a plataforma.
        </p>
      </CardContent>
    </Card>
  );
}

interface DeviceActionsProps {
  device: Device;
  onEditAlias: (device: Device) => void;
}

function DeviceActions({ device, onEditAlias }: DeviceActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditAlias(device)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar Apelido
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Linha da tabela de dispositivos - Desktop
 */
function DeviceRow({
  device,
  onEditAlias,
  onLinked,
}: {
  device: Device;
  onEditAlias: (device: Device) => void;
  onLinked: () => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {device.name || <span className="text-muted-foreground italic">Sem nome</span>}
      </TableCell>
      <TableCell>
        {device.project !== null ? (
          <span className="text-sm">Projeto #{device.project}</span>
        ) : (
          <span className="text-muted-foreground italic">Não vinculado</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge isOnline={device.is_online} />
      </TableCell>
      <TableCell>
        <LinkProjectDropdown
          deviceId={device.id}
          currentProjectId={device.project}
          onLinked={onLinked}
        />
      </TableCell>
      <TableCell className="text-right">
        <DeviceActions device={device} onEditAlias={onEditAlias} />
      </TableCell>
    </TableRow>
  );
}

/**
 * Card de dispositivo - Mobile
 */
function DeviceCard({
  device,
  onEditAlias,
  onLinked,
}: {
  device: Device;
  onEditAlias: (device: Device) => void;
  onLinked: () => void;
}) {
  const isOnline = device.is_online;

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Radio
              className={cn("h-4 w-4 shrink-0", isOnline ? "text-primary" : "text-muted-foreground")}
            />
            <span className="font-medium truncate">
              {device.name || <span className="text-muted-foreground italic">Sem nome</span>}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <StatusBadge isOnline={isOnline} />
            <DeviceActions device={device} onEditAlias={onEditAlias} />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projeto:</span>
            <span className="text-right">
              {device.project !== null ? (
                <span>Projeto #{device.project}</span>
              ) : (
                <span className="text-muted-foreground italic">Não vinculado</span>
              )}
            </span>
          </div>
          <div className="flex justify-end">
            <LinkProjectDropdown
              deviceId={device.id}
              currentProjectId={device.project}
              onLinked={onLinked}
            />
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
      <p className="text-foreground font-medium">Nenhum dispositivo registrado</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Use sua chave de API para conectar dispositivos IoT à plataforma.
      </p>
    </div>
  );
}

export function InventoryPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aliasModalOpen, setAliasModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar dispositivos.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleEditAlias = (device: Device) => {
    setEditingDevice(device);
    setAliasModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--title-primary))] sm:text-3xl">
          Inventário de Dispositivos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie seus dispositivos IoT e vincule-os aos seus projetos
        </p>
      </div>

      <div className="mb-6 sm:mb-8 max-w-xl">
        <ApiKeyDisplay />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Dispositivos Registrados</CardTitle>
            <span className="text-sm text-muted-foreground">
              {devices.length} dispositivo{devices.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" onClick={fetchDevices} className="mt-4 gap-2">
                Tentar novamente
              </Button>
            </div>
          ) : devices.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vincular</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <DeviceRow
                        key={device.id}
                        device={device}
                        onEditAlias={handleEditAlias}
                        onLinked={fetchDevices}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 pt-0 space-y-3">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onEditAlias={handleEditAlias}
                    onLinked={fetchDevices}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyDevicesState />
          )}
        </CardContent>
      </Card>

      {editingDevice && (
        <EditAliasModal
          open={aliasModalOpen}
          onOpenChange={(open) => {
            setAliasModalOpen(open);
            if (!open) setEditingDevice(null);
          }}
          deviceId={editingDevice.id}
          currentName={editingDevice.name}
          onUpdated={fetchDevices}
        />
      )}
    </div>
  );
}
