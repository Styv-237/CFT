import type { Metadata } from "next";

import { PlayerCard } from "@/components/shared/player-card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { playerCardInclude } from "@/server/queries/players";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavoritesPage() {
  const session = await auth();
  const user = session!.user;

  const favorites = await prisma.favorite.findMany({
    where: { recruiterId: user.id },
    include: { player: { include: playerCardInclude } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Mes favoris</h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} joueur{favorites.length > 1 ? "s" : ""} enregistré{favorites.length > 1 ? "s" : ""}.
        </p>
      </div>
      {favorites.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Vous n&apos;avez pas encore ajouté de joueur à vos favoris.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((favorite) => (
            <PlayerCard key={favorite.id} player={favorite.player} />
          ))}
        </div>
      )}
    </div>
  );
}
