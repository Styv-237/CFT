import { prisma } from "@/lib/prisma";

export function getCurrentSeason(leagueSlug = "elite-one") {
  return prisma.season.findFirst({
    where: { isCurrent: true, league: { slug: leagueSlug } },
    orderBy: { startDate: "desc" },
  });
}

export function getAllLeagues() {
  return prisma.league.findMany({ orderBy: { tier: "asc" } });
}

export function getLeagueBySlug(slug: string) {
  return prisma.league.findUnique({ where: { slug } });
}

export async function getLeagueStandings(leagueSlug: string) {
  const season = await getCurrentSeason(leagueSlug);
  if (!season) return [];
  return prisma.leagueStanding.findMany({
    where: { seasonId: season.id },
    include: { club: true },
    orderBy: { position: "asc" },
  });
}

export async function getLeagueMatches(leagueSlug: string, limit = 15) {
  const season = await getCurrentSeason(leagueSlug);
  if (!season) return [];
  return prisma.match.findMany({
    where: { seasonId: season.id },
    include: { homeClub: true, awayClub: true },
    orderBy: { matchDate: "asc" },
    take: limit,
  });
}

export async function getLeagueTopPerformers(leagueSlug: string, metric: "goals" | "assists", limit = 10) {
  const season = await getCurrentSeason(leagueSlug);
  if (!season) return [];
  const stats = await prisma.playerStatistics.findMany({
    where: { seasonId: season.id, [metric]: { gt: 0 } },
    orderBy: { [metric]: "desc" },
    take: limit,
    include: {
      player: {
        select: {
          id: true,
          slug: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
          club: { select: { name: true, shortName: true, logoUrl: true } },
        },
      },
    },
  });
  return stats;
}
