import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderKanban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types";
import { getProjects } from "@/services/api";
import { CreateProjectModal } from "@/components/ui/CreateProjectModal";

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
      onClick={() => navigate(`/app/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[hsl(var(--title-primary))] group-hover:text-primary line-clamp-2">
          {project.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">
          Criado em {new Date(project.created_at).toLocaleDateString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar projetos.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--title-primary))] sm:text-3xl">
            Meus Projetos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie e visualize seus projetos de monitoramento agrícola
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 shrink-0 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={fetchProjects} className="mt-4 gap-2">
            Tentar novamente
          </Button>
        </Card>
      ) : projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            Nenhum projeto encontrado
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Você ainda não possui projetos cadastrados. Crie um novo projeto
            para começar a monitorar seus dispositivos.
          </p>
          <Button onClick={() => setModalOpen(true)} className="mt-6 gap-2">
            <Plus className="h-4 w-4" />
            Criar Primeiro Projeto
          </Button>
        </Card>
      )}

      <CreateProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={fetchProjects}
      />
    </div>
  );
}
