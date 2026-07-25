import { prisma } from "@/lib/prisma";

export function getPartnerClubs(limit = 10) {
  return prisma.club.findMany({
    orderBy: { name: "asc" },
    take: limit,
    select: { id: true, name: true, slug: true, logoUrl: true, shortName: true },
  });
}

export function getAllClubs() {
  return prisma.club.findMany({
    include: { league: true, _count: { select: { players: true } } },
    orderBy: { name: "asc" },
  });
}

export function getClubBySlug(slug: string) {
  return prisma.club.findUnique({
    where: { slug },
    include: {
      league: true,
      photos: { orderBy: { createdAt: "desc" } },
      honors: { orderBy: { year: "desc" } },
      players: {
        where: { status: "APPROVED" },
        include: { club: { select: { id: true, name: true, shortName: true, slug: true, logoUrl: true } } },
        orderBy: { lastName: "asc" },
      },
    },
  });
}

export async function getClubStanding(clubId: string, leagueId: string | null) {
  if (!leagueId) return null;
  return prisma.leagueStanding.findFirst({
    where: { clubId, season: { leagueId, isCurrent: true } },
  });
}

export function getClubMatches(clubId: string, limit = 10) {
  return prisma.match.findMany({
    where: { OR: [{ homeClubId: clubId }, { awayClubId: clubId }] },
    include: { homeClub: true, awayClub: true },
    orderBy: { matchDate: "desc" },
    take: limit,
  });
}
