import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPlayerBySlug } from "@/server/queries/players";
import { calculateAge } from "@/lib/utils";
import { POSITION_LABELS } from "@/lib/labels";

import { PlayerHeader } from "./_components/player-header";
import { PlayerTabsShell } from "./_components/player-tabs-shell";
import { OverviewTab } from "./_components/overview-tab";
import { StatsTab } from "./_components/stats-tab";
import { TechnicalTab } from "./_components/technical-tab";
import { VideoGallery } from "./_components/video-gallery";
import { PhotoGallery } from "./_components/photo-gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) return { title: "Joueur introuvable" };

  const age = calculateAge(player.birthDate);
  return {
    title: `${player.firstName} ${player.lastName} — ${POSITION_LABELS[player.position]}`,
    description: `${player.firstName} ${player.lastName}, ${age} ans, ${POSITION_LABELS[player.position]} camerounais${player.club ? ` évoluant à ${player.club.name}` : ""}. Statistiques, vidéos et fiche technique complètes.`,
    openGraph: {
      images: player.photoUrl ? [player.photoUrl] : undefined,
    },
  };
}

export default async function PlayerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { slug } = await params;
  const { onglet } = await searchParams;
  const player = await getPlayerBySlug(slug);

  if (!player) notFound();

  return (
    <div className="pb-20">
      <PlayerHeader player={player} />

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <PlayerTabsShell
          defaultTab={onglet === "videos" ? "videos" : onglet === "photos" ? "photos" : "apercu"}
          overview={<OverviewTab player={player} />}
          stats={<StatsTab player={player} />}
          technical={<TechnicalTab player={player} />}
          videos={<VideoGallery videos={player.videos} />}
          photos={<PhotoGallery photos={player.photos} />}
        />
      </div>
    </div>
  );
}
