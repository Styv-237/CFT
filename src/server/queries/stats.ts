import { prisma } from "@/lib/prisma";

export async function getGlobalStats() {
  const [players, clubs, recruiters, videos, matches, goalsAgg] = await Promise.all([
    prisma.player.count({ where: { status: "APPROVED" } }),
    prisma.club.count(),
    prisma.user.count({ where: { role: "RECRUITER" } }),
    prisma.playerVideo.count(),
    prisma.match.count(),
    prisma.playerStatistics.aggregate({ _sum: { goals: true } }),
  ]);

  return {
    players,
    clubs,
    recruiters,
    videos,
    matches,
    goals: goalsAgg._sum.goals ?? 0,
  };
}
