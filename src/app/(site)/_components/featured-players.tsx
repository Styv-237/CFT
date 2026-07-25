import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlayerCard } from "@/components/shared/player-card";
import { getFeaturedPlayers } from "@/server/queries/players";

export async function FeaturedPlayers() {
  const players = await getFeaturedPlayers(8);
  if (players.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="À la une"
          title="Joueurs vedettes"
          description="Une sélection des talents les plus en vue du football camerounais, suivis de près par les recruteurs."
        />
        <Button variant="ghost" asChild className="shrink-0">
          <Link href="/joueurs">
            Voir tous les joueurs
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
