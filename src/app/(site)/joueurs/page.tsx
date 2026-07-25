import type { Metadata } from "next";

import { PlayerCard } from "@/components/shared/player-card";
import { Pagination } from "@/components/shared/pagination";
import { parsePlayerSearchParams } from "@/lib/player-filters";
import { getPlayerFilterOptions, searchPlayers } from "@/server/queries/players";

import { PlayersFilters } from "./_components/players-filters";

export const metadata: Metadata = {
  title: "Répertoire des joueurs",
  description:
    "Parcourez le répertoire des joueurs camerounais : filtrez par club, championnat, poste, âge, gabarit et disponibilité.",
};

export default async function PlayersDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const filters = parsePlayerSearchParams(resolvedParams);

  const [{ players, total, page, pageCount }, options] = await Promise.all([
    searchPlayers(filters),
    getPlayerFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Répertoire des joueurs</h1>
        <p className="text-sm text-muted-foreground">
          {total} joueur{total > 1 ? "s" : ""} référencé{total > 1 ? "s" : ""} — affinez votre
          recherche grâce aux filtres ci-dessous.
        </p>
      </div>

      <PlayersFilters options={options} />

      {players.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-lg font-semibold">Aucun joueur ne correspond à ces critères</p>
          <p className="text-sm text-muted-foreground">Essayez d&apos;élargir vos filtres de recherche.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={page} pageCount={pageCount} />
          </div>
        </>
      )}
    </div>
  );
}
