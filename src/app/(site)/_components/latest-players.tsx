import { SectionHeading } from "@/components/shared/section-heading";
import { PlayerCard } from "@/components/shared/player-card";
import { getLatestPlayers } from "@/server/queries/players";

export async function LatestPlayers() {
  const players = await getLatestPlayers(4);
  if (players.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Fraîchement inscrits"
        title="Derniers joueurs inscrits"
        description="De nouveaux profils rejoignent la plateforme chaque semaine."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
