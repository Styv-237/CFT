import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SimpleTabs } from "@/components/shared/simple-tabs";
import { formatDate } from "@/lib/utils";
import {
  getLeagueBySlug,
  getLeagueMatches,
  getLeagueStandings,
  getLeagueTopPerformers,
} from "@/server/queries/leagues";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const league = await getLeagueBySlug(slug);
  if (!league) return { title: "Championnat introuvable" };
  return { title: league.name, description: league.description ?? undefined };
}

function EmptyState({ message }: { message: string }) {
  return <p className="py-12 text-center text-sm text-muted-foreground">{message}</p>;
}

export default async function LeagueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const league = await getLeagueBySlug(slug);
  if (!league) notFound();

  const [standings, matches, scorers, assists] = await Promise.all([
    getLeagueStandings(slug),
    getLeagueMatches(slug),
    getLeagueTopPerformers(slug, "goals"),
    getLeagueTopPerformers(slug, "assists"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        {league.logoUrl && (
          <Image src={league.logoUrl} alt={league.name} width={64} height={64} className="size-16 rounded-full bg-secondary" />
        )}
        <div>
          <Badge variant="secondary">{league.type === "CUP" ? "Coupe" : "Championnat"}</Badge>
          <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">{league.name}</h1>
        </div>
      </div>
      {league.description && <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{league.description}</p>}

      <div className="mt-10">
        <SimpleTabs
          defaultValue="classement"
          tabs={[
            {
              value: "classement",
              label: "Classement",
              content:
                standings.length === 0 ? (
                  <EmptyState message="Classement non disponible pour cette compétition." />
                ) : (
                  <Card className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6">#</TableHead>
                          <TableHead>Club</TableHead>
                          <TableHead className="text-center">J</TableHead>
                          <TableHead className="text-center">G</TableHead>
                          <TableHead className="text-center">N</TableHead>
                          <TableHead className="text-center">P</TableHead>
                          <TableHead className="text-center">BP</TableHead>
                          <TableHead className="text-center">BC</TableHead>
                          <TableHead className="pr-6 text-center">Pts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {standings.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="pl-6 font-medium">{s.position}</TableCell>
                            <TableCell>
                              <Link href={`/clubs/${s.club.slug}`} className="flex items-center gap-2 hover:text-primary">
                                {s.club.logoUrl && (
                                  <Image src={s.club.logoUrl} alt="" width={20} height={20} className="size-5 rounded-full" />
                                )}
                                {s.club.name}
                              </Link>
                            </TableCell>
                            <TableCell className="text-center">{s.played}</TableCell>
                            <TableCell className="text-center">{s.won}</TableCell>
                            <TableCell className="text-center">{s.drawn}</TableCell>
                            <TableCell className="text-center">{s.lost}</TableCell>
                            <TableCell className="text-center">{s.goalsFor}</TableCell>
                            <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                            <TableCell className="pr-6 text-center font-display font-bold">{s.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ),
            },
            {
              value: "calendrier",
              label: "Calendrier",
              content:
                matches.length === 0 ? (
                  <EmptyState message="Calendrier non disponible pour cette compétition." />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col gap-2 py-6">
                      {matches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-3 text-sm">
                          <span className="w-28 shrink-0 text-xs text-muted-foreground">{formatDate(match.matchDate)}</span>
                          <span className="flex-1 text-center font-medium">
                            {match.homeClub.name} vs {match.awayClub.name}
                          </span>
                          <span className="w-16 shrink-0 text-right font-display font-bold">
                            {match.status === "FINISHED" ? `${match.homeScore} - ${match.awayScore}` : "—"}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ),
            },
            {
              value: "statistiques",
              label: "Statistiques",
              content: (
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardContent className="flex flex-col gap-3 py-6">
                      <h3 className="font-display font-semibold">⚽ Meilleurs buteurs</h3>
                      {scorers.length === 0 ? (
                        <EmptyState message="Aucune donnée." />
                      ) : (
                        scorers.map((s, i) => (
                          <Link
                            key={s.id}
                            href={`/joueurs/${s.player.slug}`}
                            className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-secondary"
                          >
                            <span className="w-5 text-center text-sm text-muted-foreground">{i + 1}</span>
                            <span className="flex-1 text-sm font-medium">
                              {s.player.firstName} {s.player.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{s.player.club?.name}</span>
                            <span className="font-display font-bold text-primary dark:text-accent">{s.goals}</span>
                          </Link>
                        ))
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col gap-3 py-6">
                      <h3 className="font-display font-semibold">🎯 Meilleurs passeurs</h3>
                      {assists.length === 0 ? (
                        <EmptyState message="Aucune donnée." />
                      ) : (
                        assists.map((s, i) => (
                          <Link
                            key={s.id}
                            href={`/joueurs/${s.player.slug}`}
                            className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-secondary"
                          >
                            <span className="w-5 text-center text-sm text-muted-foreground">{i + 1}</span>
                            <span className="flex-1 text-sm font-medium">
                              {s.player.firstName} {s.player.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{s.player.club?.name}</span>
                            <span className="font-display font-bold text-primary dark:text-accent">{s.assists}</span>
                          </Link>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
