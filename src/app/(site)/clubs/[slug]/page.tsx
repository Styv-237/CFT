import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPinIcon, TrophyIcon, UserIcon, UsersIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerCard } from "@/components/shared/player-card";
import { formatDate } from "@/lib/utils";
import { getClubBySlug, getClubMatches, getClubStanding } from "@/server/queries/clubs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) return { title: "Club introuvable" };
  return {
    title: club.name,
    description: club.description ?? `Découvrez la fiche du club ${club.name}, basé à ${club.city}.`,
  };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const [standing, matches] = await Promise.all([
    getClubStanding(club.id, club.leagueId),
    getClubMatches(club.id, 8),
  ]);

  return (
    <div className="pb-20">
      <div className="relative h-56 w-full overflow-hidden bg-primary sm:h-72">
        {club.coverUrl && <Image src={club.coverUrl} alt="" fill className="object-cover opacity-50" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative -mt-16 flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-background bg-card shadow-lg sm:-mt-20 sm:size-36">
            {club.logoUrl && <Image src={club.logoUrl} alt={club.name} fill className="object-cover p-2" />}
          </div>
          <div className="flex flex-1 flex-col gap-2 pb-1">
            {club.league && <Badge className="w-fit">{club.league.name}</Badge>}
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{club.name}</h1>
            <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-3.5" /> {club.city}
              </span>
              {club.stadiumName && (
                <>
                  <span aria-hidden>·</span>
                  <span>{club.stadiumName}</span>
                </>
              )}
              {club.foundedYear && (
                <>
                  <span aria-hidden>·</span>
                  <span>Fondé en {club.foundedYear}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            {club.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                  {club.description}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="size-4" /> Effectif ({club.players.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                {club.players.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun joueur référencé pour ce club.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {club.players.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="size-4" /> Calendrier
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 pb-6">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between rounded-xl bg-secondary/50 p-3 text-sm"
                    >
                      <span className="w-24 shrink-0 text-xs text-muted-foreground">
                        {formatDate(match.matchDate)}
                      </span>
                      <span className="flex-1 text-center font-medium">
                        {match.homeClub.shortName ?? match.homeClub.name}
                        {" vs "}
                        {match.awayClub.shortName ?? match.awayClub.name}
                      </span>
                      <span className="w-16 shrink-0 text-right font-display font-bold">
                        {match.status === "FINISHED" ? `${match.homeScore} - ${match.awayScore}` : "—"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {standing && (
              <Card>
                <CardHeader>
                  <CardTitle>Classement — saison en cours</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 pb-6 text-center">
                  <div>
                    <p className="font-display text-2xl font-bold">{standing.position}e</p>
                    <p className="text-xs text-muted-foreground">Position</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold">{standing.points}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold">{standing.played}</p>
                    <p className="text-xs text-muted-foreground">Matchs</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-success">{standing.won}</p>
                    <p className="text-xs text-muted-foreground">Victoires</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-warning">{standing.drawn}</p>
                    <p className="text-xs text-muted-foreground">Nuls</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-destructive">{standing.lost}</p>
                    <p className="text-xs text-muted-foreground">Défaites</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pb-6 text-sm">
                {club.coachName && (
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <UserIcon className="size-3.5" /> Entraîneur
                    </span>
                    <span className="font-medium">{club.coachName}</span>
                  </div>
                )}
                {club.stadiumCapacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Capacité du stade</span>
                    <span className="font-medium">{club.stadiumCapacity.toLocaleString("fr-FR")} places</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {club.honors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrophyIcon className="size-4 text-accent" /> Palmarès
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 pb-6">
                  {club.honors.map((h) => (
                    <div key={h.id} className="text-sm">
                      <p className="font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {h.competition} {h.seasonLabel ? `· ${h.seasonLabel}` : ""}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {club.photos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 pb-6">
                  {club.photos.slice(0, 6).map((photo) => (
                    <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                      <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
