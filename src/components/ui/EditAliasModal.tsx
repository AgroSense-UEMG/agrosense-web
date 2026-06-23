import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateDevice } from "@/services/api";

interface EditAliasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: number;
  currentName: string;
  onUpdated: () => void;
}

export function EditAliasModal({
  open,
  onOpenChange,
  deviceId,
  currentName,
  onUpdated,
}: EditAliasModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (open) {
      setName(currentName);
      setErro("");
    }
  }, [open, currentName]);

  const handleSubmit = async () => {
    setErro("");

    if (!name.trim()) {
      setErro("O nome do dispositivo é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await updateDevice(deviceId, { name: name.trim() });
      toast.success("Apelido atualizado!");
      onOpenChange(false);
      onUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar dispositivo.";
      setErro(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setErro("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar Apelido</DialogTitle>
          <DialogDescription>Altere o nome de identificação do dispositivo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="alias-name">Nome do dispositivo</Label>
            <Input
              id="alias-name"
              placeholder="Ex: Nó Sensor 01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
