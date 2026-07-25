import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentSeason } from "@/server/queries/leagues";
import type { PlayerSearchFilters } from "@/lib/player-filters";

const PAGE_SIZE = 12;

function ageToBirthDateRange(ageMin?: number, ageMax?: number) {
  if (ageMin === undefined && ageMax === undefined) return undefined;
  const now = new Date();
  const range: { gte?: Date; lte?: Date } = {};
  if (ageMax !== undefined) {
    range.gte = new Date(now.getFullYear() - ageMax - 1, now.getMonth(), now.getDate());
  }
  if (ageMin !== undefined) {
    range.lte = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate());
  }
  return range;
}

export async function buildPlayerWhere(filters: PlayerSearchFilters): Promise<Prisma.PlayerWhereInput> {
  const birthDate = ageToBirthDateRange(filters.ageMin, filters.ageMax);
  const season = filters.minMatches !== undefined || filters.minPassAccuracy !== undefined
    ? await getCurrentSeason()
    : null;

  const where: Prisma.PlayerWhereInput = {
    status: "APPROVED",
    ...(filters.q && {
      OR: [
        { firstName: { contains: filters.q, mode: "insensitive" } },
        { lastName: { contains: filters.q, mode: "insensitive" } },
      ],
    }),
    ...(filters.clubSlug && { club: { slug: filters.clubSlug } }),
    ...(filters.leagueSlug && { club: { league: { slug: filters.leagueSlug } } }),
    ...(filters.position && { position: filters.position }),
    ...(filters.foot && { preferredFoot: filters.foot }),
    ...(filters.nationality && { nationality: { contains: filters.nationality, mode: "insensitive" } }),
    ...(filters.availability && { availability: filters.availability }),
    ...(birthDate && { birthDate }),
    ...((filters.heightMin !== undefined || filters.heightMax !== undefined) && {
      heightCm: { gte: filters.heightMin, lte: filters.heightMax },
    }),
    ...((filters.weightMin !== undefined || filters.weightMax !== undefined) && {
      weightKg: { gte: filters.weightMin, lte: filters.weightMax },
    }),
    ...(filters.valueMax !== undefined && { estimatedValue: { lte: filters.valueMax } }),
    ...(season &&
      (filters.minMatches !== undefined || filters.minPassAccuracy !== undefined) && {
        statistics: {
          some: {
            seasonId: season.id,
            ...(filters.minMatches !== undefined && { matches: { gte: filters.minMatches } }),
            ...(filters.minPassAccuracy !== undefined && { passAccuracy: { gte: filters.minPassAccuracy } }),
          },
        },
      }),
  };

  return where;
}

export async function searchPlayers(filters: PlayerSearchFilters) {
  const where = await buildPlayerWhere(filters);
  const page = Math.max(1, filters.page ?? 1);

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      include: playerCardInclude,
      orderBy: [{ featured: "desc" }, { estimatedValue: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.player.count({ where }),
  ]);

  return { players, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getPlayerFilterOptions() {
  const [clubs, leagues, nationalities] = await Promise.all([
    prisma.club.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
    prisma.league.findMany({ select: { slug: true, name: true }, orderBy: { tier: "asc" } }),
    prisma.player.findMany({
      select: { nationality: true },
      distinct: ["nationality"],
      orderBy: { nationality: "asc" },
    }),
  ]);
  return { clubs, leagues, nationalities: nationalities.map((n) => n.nationality) };
}

export const playerCardInclude = {
  club: { select: { id: true, name: true, shortName: true, slug: true, logoUrl: true } },
} satisfies Prisma.PlayerInclude;

export type PlayerCard = Prisma.PlayerGetPayload<{ include: typeof playerCardInclude }>;

export function getFeaturedPlayers(limit = 8) {
  return prisma.player.findMany({
    where: { status: "APPROVED", featured: true },
    include: playerCardInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export function getLatestPlayers(limit = 8) {
  return prisma.player.findMany({
    where: { status: "APPROVED" },
    include: playerCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getTopScorers(limit = 5) {
  const season = await getCurrentSeason();
  if (!season) return [];

  const stats = await prisma.playerStatistics.findMany({
    where: { seasonId: season.id, goals: { gt: 0 } },
    orderBy: { goals: "desc" },
    take: limit,
    include: { player: { include: playerCardInclude } },
  });

  return stats.map((s) => ({ player: s.player, goals: s.goals, assists: s.assists, matches: s.matches }));
}

export async function getTopAssists(limit = 5) {
  const season = await getCurrentSeason();
  if (!season) return [];

  const stats = await prisma.playerStatistics.findMany({
    where: { seasonId: season.id, assists: { gt: 0 } },
    orderBy: { assists: "desc" },
    take: limit,
    include: { player: { include: playerCardInclude } },
  });

  return stats.map((s) => ({ player: s.player, goals: s.goals, assists: s.assists, matches: s.matches }));
}

export function getLatestVideos(limit = 6) {
  return prisma.playerVideo.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { player: { select: { firstName: true, lastName: true, slug: true, photoUrl: true } } },
  });
}

export function autocompletePlayers(query: string, limit = 8) {
  if (!query || query.trim().length < 2) return Promise.resolve([]);
  return prisma.player.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
      ],
    },
    include: playerCardInclude,
    take: limit,
  });
}

export function getPlayerBySlug(slug: string) {
  return prisma.player.findUnique({
    where: { slug },
    include: {
      club: true,
      agent: true,
      academy: true,
      technicalProfile: true,
      statistics: { include: { season: true, club: true }, orderBy: { season: { startDate: "desc" } } },
      videos: { orderBy: { createdAt: "desc" } },
      photos: { orderBy: { createdAt: "desc" } },
      careerHistory: { include: { club: true }, orderBy: { startDate: "desc" } },
      transfersFrom: { include: { fromClub: true, toClub: true }, orderBy: { transferDate: "desc" } },
      honors: { orderBy: { year: "desc" } },
      nationalTeamCalls: { include: { nationalTeam: true } },
      injuries: { orderBy: { startDate: "desc" } },
      suspensions: { orderBy: { startDate: "desc" } },
    },
  });
}

export type PlayerProfile = NonNullable<Awaited<ReturnType<typeof getPlayerBySlug>>>;

export async function getPlayerContactReceiverId(player: { userId: string | null; clubId: string | null }) {
  if (player.userId) return player.userId;
  if (!player.clubId) return null;
  const manager = await prisma.user.findFirst({ where: { clubId: player.clubId }, select: { id: true } });
  return manager?.id ?? null;
}
