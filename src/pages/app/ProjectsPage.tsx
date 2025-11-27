import { useNavigate } from "react-router-dom";
import { Plus, User, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { mockProjects, mockUser, isUserCoordinator } from "@/mocks";

/**
 * Card de Projeto
 * 
 * Conforme especificação:
 * - Mostrar Título, Descrição curta, Nome do Coordenador e Status (Ativo)
 * - Clicar no card navega para /app/projects/:id
 */
function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
      onClick={() => navigate(`/app/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-[hsl(var(--title-primary))] group-hover:text-primary line-clamp-2">
            {project.title}
          </CardTitle>
          <Badge
            variant={project.status === "active" ? "default" : "secondary"}
            className={
              project.status === "active"
                ? "bg-primary text-primary-foreground shrink-0"
                : "shrink-0"
            }
          >
            {project.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span className="truncate">{project.coordinator}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <FolderKanban className="h-4 w-4" />
            <span>{project.devicesCount} dispositivos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Página de Lista de Projetos
 * Rota: /app/projects
 * 
 * Conforme especificação:
 * - UI: Grid de Cards
 * - Ação (Coordenador): Botão "Novo Projeto" -> Abre Modal com campos Nome e Descrição
 * - Ação (Geral): Clicar no card navega para /app/projects/:id
 */
export function ProjectsPage() {
  const isCoordinator = isUserCoordinator(mockUser);

  const handleNewProject = () => {
    // TODO: Implementar modal de criação de projeto (Sprint 2)
    console.log("Abrir modal de novo projeto");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--title-primary))] sm:text-3xl">
            Meus Projetos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie e visualize seus projetos de monitoramento agrícola
          </p>
        </div>

        {isCoordinator && (
          <Button onClick={handleNewProject} className="gap-2 shrink-0 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        )}
      </div>

      {/* Grid de Cards */}
      {mockProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Estado Vazio */
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            Nenhum projeto encontrado
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Você ainda não possui projetos cadastrados. Crie um novo projeto
            para começar a monitorar seus dispositivos.
          </p>
          {isCoordinator && (
            <Button onClick={handleNewProject} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Projeto
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
