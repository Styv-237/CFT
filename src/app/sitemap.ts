import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [players, clubs, leagues, news] = await Promise.all([
    prisma.player.findMany({ where: { status: "APPROVED" }, select: { slug: true, updatedAt: true } }),
    prisma.club.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.league.findMany({ select: { slug: true } }),
    prisma.news.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/joueurs",
    "/clubs",
    "/championnats",
    "/actualites",
    "/comparateur",
    "/recherche",
    "/connexion",
    "/inscription",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  const playerRoutes: MetadataRoute.Sitemap = players.map((p) => ({
    url: `${BASE_URL}/joueurs/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const clubRoutes: MetadataRoute.Sitemap = clubs.map((c) => ({
    url: `${BASE_URL}/clubs/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const leagueRoutes: MetadataRoute.Sitemap = leagues.map((l) => ({
    url: `${BASE_URL}/championnats/${l.slug}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${BASE_URL}/actualites/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...playerRoutes, ...clubRoutes, ...leagueRoutes, ...newsRoutes];
}
