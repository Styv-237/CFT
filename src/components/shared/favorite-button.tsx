"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/server/actions/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  playerId,
  playerSlug,
  initialFavorited,
  canFavorite,
}: {
  playerId: string;
  playerSlug: string;
  initialFavorited: boolean;
  canFavorite: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = React.useState(initialFavorited);
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="outline"
      onClick={() => {
        if (!canFavorite) {
          router.push(`/connexion?callbackUrl=/joueurs/${playerSlug}`);
          return;
        }
        startTransition(async () => {
          const result = await toggleFavorite(playerId, playerSlug);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          setFavorited(result.favorited ?? false);
          toast.success(result.favorited ? "Ajouté aux favoris" : "Retiré des favoris");
        });
      }}
      disabled={isPending}
      className="gap-2"
    >
      <StarIcon className={cn("size-4", favorited && "fill-accent text-accent")} />
      {favorited ? "Dans vos favoris" : "Ajouter aux favoris"}
    </Button>
  );
}
