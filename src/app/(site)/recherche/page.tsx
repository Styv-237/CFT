import type { Metadata } from "next";

import { PlayerCard } from "@/components/shared/player-card";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";
import { parsePlayerSearchParams } from "@/lib/player-filters";
import { getPlayerFilterOptions, searchPlayers } from "@/server/queries/players";

import { AdvancedSearchForm } from "./_components/advanced-search-form";

export const metadata: Metadata = {
  title: "Recherche avancée",
  description:
    "Moteur de recherche professionnel : combinez poste, âge, championnat, matchs joués, pied fort, précision de passes et gabarit.",
};

export default async function AdvancedSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const filters = parsePlayerSearchParams(resolvedParams);
  const hasFilters = Object.entries(resolvedParams).some(([key, v]) => key !== "page" && v);

  const [{ players, total, page, pageCount }, options] = await Promise.all([
    searchPlayers(filters),
    getPlayerFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Outil de scouting"
        title="Recherche avancée"
        description="Combinez plusieurs critères professionnels pour identifier instantanément les profils qui vous intéressent."
      />

      <div className="mt-8">
        <AdvancedSearchForm options={options} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} joueur{total > 1 ? "s" : ""} correspond{total > 1 ? "ent" : ""} à vos critères
        </p>
      </div>

      {players.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 py-16 text-center">
          <p className="font-display text-lg font-semibold">
            {hasFilters ? "Aucun joueur ne correspond à ces critères" : "Définissez vos critères de recherche"}
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            {hasFilters
              ? "Essayez d'élargir vos filtres."
              : "Exemple : défenseur, moins de 22 ans, Elite One, plus de 20 matchs, gaucher, plus de 80% de passes réussies, taille supérieure à 1,85 m."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
