import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link2, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProjects, updateDevice } from "@/services/api";
import type { Project } from "@/types";

interface LinkProjectDropdownProps {
  deviceId: number;
  currentProjectId: number | null;
  onLinked: () => void;
}

export function LinkProjectDropdown({
  deviceId,
  currentProjectId,
  onLinked,
}: LinkProjectDropdownProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => toast.error("Erro ao carregar projetos."));
  }, []);

  const handleLink = async (projectId: number | null) => {
    setLoading(true);
    try {
      await updateDevice(deviceId, { project_id: projectId });
      toast.success(projectId ? "Dispositivo vinculado!" : "Dispositivo desvinculado.");
      onLinked();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao vincular dispositivo.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <Link2 className="mr-1.5 h-3.5 w-3.5" />
          {loading ? "Vinculando..." : "Vincular"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Vincular a Projeto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleLink(project.id)}
            disabled={project.id === currentProjectId}
          >
            <Link2 className="mr-2 h-4 w-4" />
            <span className="truncate">{project.name}</span>
          </DropdownMenuItem>
        ))}
        {projects.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem
          onClick={() => handleLink(null)}
          disabled={currentProjectId === null}
          className="text-muted-foreground"
        >
          <Unlink className="mr-2 h-4 w-4" />
          Desvincular
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
