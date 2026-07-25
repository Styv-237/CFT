"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deletePlayerAdmin, setPlayerStatus } from "@/server/actions/admin/players";

export function PlayerRowActions({ playerId, status }: { playerId: string; status: string }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const run = (action: () => Promise<{ error?: string }>, message: string) => {
    startTransition(async () => {
      const result = await action();
      if (result.error) toast.error(result.error);
      else {
        toast.success(message);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {status !== "APPROVED" && (
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => run(() => setPlayerStatus(playerId, "APPROVED"), "Profil approuvé")}
          title="Approuver"
        >
          <CheckIcon className="size-4 text-success" />
        </Button>
      )}
      {status !== "REJECTED" && (
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => run(() => setPlayerStatus(playerId, "REJECTED"), "Profil rejeté")}
          title="Rejeter"
        >
          <XIcon className="size-4 text-destructive" />
        </Button>
      )}
      <Button variant="ghost" size="icon" asChild title="Modifier">
        <Link href={`/admin/joueurs/${playerId}`}>
          <PencilIcon className="size-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={() => {
          if (confirm("Supprimer définitivement ce joueur ?")) {
            run(() => deletePlayerAdmin(playerId), "Joueur supprimé");
          }
        }}
        title="Supprimer"
      >
        <TrashIcon className="size-4 text-destructive" />
      </Button>
    </div>
  );
}
