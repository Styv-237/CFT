"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteClubAdmin } from "@/server/actions/admin/clubs";

export function DeleteClubButton({ clubId }: { clubId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Supprimer définitivement ce club ?")) return;
        startTransition(async () => {
          const result = await deleteClubAdmin(clubId);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Club supprimé");
            router.refresh();
          }
        });
      }}
    >
      <TrashIcon className="size-4 text-destructive" />
    </Button>
  );
}
