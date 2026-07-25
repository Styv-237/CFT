import type { Metadata } from "next";
import { SplitSquareHorizontalIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparisonRadarChart } from "@/components/shared/comparison-radar-chart";
import { SectionHeading } from "@/components/shared/section-heading";
import { TECHNICAL_ATTRIBUTE_LABELS } from "@/lib/labels";
import { calculateAge, formatCurrency } from "@/lib/utils";
import { getPlayerBySlug } from "@/server/queries/players";

import { PlayerPicker } from "./_components/player-picker";
import { PlayerSummaryCard } from "./_components/player-summary-card";
import { ComparisonTable } from "./_components/comparison-table";

export const metadata: Metadata = {
  title: "Comparateur de joueurs",
  description:
    "Comparez deux joueurs camerounais côte à côte : âge, gabarit, statistiques, fiche technique, vidéos et trophées.",
};

export default async function ComparatorPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;

  const [playerA, playerB] = await Promise.all([
    a ? getPlayerBySlug(a) : null,
    b ? getPlayerBySlug(b) : null,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Outil de scouting"
        title="Comparateur de joueurs"
        description="Sélectionnez deux joueurs pour comparer leur profil, leurs statistiques et leur fiche technique."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <PlayerPicker
          slotKey="a"
          label="le premier joueur"
          currentSlug={playerA?.slug}
          currentLabel={playerA ? `${playerA.firstName} ${playerA.lastName}` : undefined}
        />
        <PlayerPicker
          slotKey="b"
          label="le second joueur"
          currentSlug={playerB?.slug}
          currentLabel={playerB ? `${playerB.firstName} ${playerB.lastName}` : undefined}
        />
      </div>

      {!playerA || !playerB ? (
        <div className="mt-16 flex flex-col items-center gap-3 py-12 text-center">
          <SplitSquareHorizontalIcon className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">Choisissez deux joueurs à comparer</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Utilisez les champs de recherche ci-dessus pour sélectionner les profils que vous
            souhaitez confronter.
          </p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4">
            <PlayerSummaryCard player={playerA} />
            <PlayerSummaryCard player={playerB} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <ComparisonTable
                nameA={playerA.firstName}
                nameB={playerB.firstName}
                rows={[
                  { label: "Âge", a: calculateAge(playerA.birthDate), b: calculateAge(playerB.birthDate) },
                  { label: "Taille (cm)", a: playerA.heightCm ?? "N/C", b: playerB.heightCm ?? "N/C" },
                  { label: "Poids (kg)", a: playerA.weightKg ?? "N/C", b: playerB.weightKg ?? "N/C" },
                  {
                    label: "Valeur estimée",
                    a: formatCurrency(playerA.estimatedValue),
                    b: formatCurrency(playerB.estimatedValue),
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques (dernière saison)</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <ComparisonTable
                nameA={playerA.firstName}
                nameB={playerB.firstName}
                rows={[
                  {
                    label: "Matchs joués",
                    a: playerA.statistics[0]?.matches ?? 0,
                    b: playerB.statistics[0]?.matches ?? 0,
                    higherIsBetter: true,
                  },
                  {
                    label: "Buts",
                    a: playerA.statistics[0]?.goals ?? 0,
                    b: playerB.statistics[0]?.goals ?? 0,
                    higherIsBetter: true,
                  },
                  {
                    label: "Passes décisives",
                    a: playerA.statistics[0]?.assists ?? 0,
                    b: playerB.statistics[0]?.assists ?? 0,
                    higherIsBetter: true,
                  },
                  {
                    label: "Minutes jouées",
                    a: playerA.statistics[0]?.minutesPlayed ?? 0,
                    b: playerB.statistics[0]?.minutesPlayed ?? 0,
                    higherIsBetter: true,
                  },
                  {
                    label: "Précision des passes",
                    a: `${playerA.statistics[0]?.passAccuracy ?? 0}%`,
                    b: `${playerB.statistics[0]?.passAccuracy ?? 0}%`,
                    higherIsBetter: true,
                  },
                  {
                    label: "Vidéos disponibles",
                    a: playerA.videos.length,
                    b: playerB.videos.length,
                    higherIsBetter: true,
                  },
                  {
                    label: "Trophées",
                    a: playerA.honors.length,
                    b: playerB.honors.length,
                    higherIsBetter: true,
                  },
                ]}
              />
            </CardContent>
          </Card>

          {playerA.technicalProfile && playerB.technicalProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Fiche technique</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <ComparisonRadarChart
                  nameA={playerA.firstName}
                  nameB={playerB.firstName}
                  data={Object.entries(TECHNICAL_ATTRIBUTE_LABELS).map(([key, label]) => ({
                    attribute: label,
                    a: playerA.technicalProfile![key as keyof typeof playerA.technicalProfile] as number,
                    b: playerB.technicalProfile![key as keyof typeof playerB.technicalProfile] as number,
                  }))}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
