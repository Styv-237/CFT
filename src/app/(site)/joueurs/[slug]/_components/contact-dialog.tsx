"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageSquareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/server/actions/messages";

export function ContactDialog({
  receiverId,
  playerName,
  canContact,
  playerSlug,
}: {
  receiverId: string | null;
  playerName: string;
  canContact: boolean;
  playerSlug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState(
    `Bonjour, je suis intéressé(e) par le profil de ${playerName}. Serait-il possible d'échanger sur ses disponibilités ?`
  );
  const [isPending, startTransition] = React.useTransition();

  if (!receiverId) {
    return (
      <Button variant="secondary" disabled className="gap-2">
        <MessageSquareIcon className="size-4" />
        Contact via agent uniquement
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next && !canContact) {
          router.push(`/connexion?callbackUrl=/joueurs/${playerSlug}`);
          return;
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <MessageSquareIcon className="size-4" />
          Contacter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contacter à propos de {playerName}</DialogTitle>
          <DialogDescription>
            Votre message sera envoyé via la messagerie interne de CFT.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Votre message…"
        />
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const result = await sendMessage(receiverId, content);
                if (result.error) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Message envoyé");
                setOpen(false);
              });
            }}
          >
            Envoyer le message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
