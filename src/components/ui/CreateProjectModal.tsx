import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createProject } from "@/services/api";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateProjectModal({ open, onOpenChange, onCreated }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async () => {
    setErro("");

    if (!name.trim()) {
      setErro("O nome do projeto é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await createProject({ name: name.trim(), description: description.trim() || undefined });
      toast.success("Projeto criado com sucesso!");
      setName("");
      setDescription("");
      onOpenChange(false);
      onCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar projeto.";
      setErro(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setErro("");
      setName("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo projeto de monitoramento.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nome *</Label>
            <Input
              id="project-name"
              placeholder="Ex: Monitoramento de Solo - Fazenda Santa Clara"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-desc">Descrição</Label>
            <Textarea
              id="project-desc"
              placeholder="Descreva o objetivo do projeto..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Criando..." : "Criar Projeto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
