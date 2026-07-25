"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteNewsAdmin } from "@/server/actions/admin/news";

export function DeleteNewsButton({ newsId }: { newsId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Supprimer cet article ?")) return;
        startTransition(async () => {
          const result = await deleteNewsAdmin(newsId);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Article supprimé");
            router.refresh();
          }
        });
      }}
    >
      <TrashIcon className="size-4 text-destructive" />
    </Button>
  );
}
