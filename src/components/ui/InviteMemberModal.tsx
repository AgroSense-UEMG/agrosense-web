import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { inviteMember } from "@/services/api";
import { toast } from "sonner";

const DOMINIOS_PERMITIDOS = [
  "uemg.br",
  "discente.uemg.br",
  "docente.uemg.br",
  "unitri.edu.br",
  "souunitri.com.br",
];

function validarEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Informe um email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Email inválido.";
  const dominio = trimmed.split("@")[1]?.toLowerCase();
  if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
    return `Domínio não permitido. Use um dos seguintes: ${DOMINIOS_PERMITIDOS.join(", ")}.`;
  }
  return null;
}

interface InviteMemberModalProps {
  projectId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited: () => void;
}

export function InviteMemberModal({ projectId, open, onOpenChange, onInvited }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleClose = () => {
    setEmail("");
    setErro(null);
    onOpenChange(false);
  };

  const handleInvite = async () => {
    const msg = validarEmail(email);
    if (msg) {
      setErro(msg);
      return;
    }

    setEnviando(true);
    setErro(null);
    try {
      await inviteMember(projectId, email.trim());
      toast.success(`Convite enviado para ${email.trim()}`);
      handleClose();
      onInvited();
    } catch {
      toast.error("Erro ao enviar convite.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar Membro</DialogTitle>
          <DialogDescription>
            Envie um convite para um pesquisador participar deste projeto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="email-convite" className="text-sm font-medium">
              Email institucional
            </label>
            <input
              id="email-convite"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(null); }}
              placeholder="pesquisador@uemg.br"
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
            />
            {erro && <p className="text-xs text-destructive">{erro}</p>}
            <p className="text-xs text-muted-foreground">
              Domínios aceitos: {DOMINIOS_PERMITIDOS.join(", ")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button onClick={handleInvite} disabled={enviando || !email.trim()}>
            {enviando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Convidar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
