import { prisma } from "@/lib/prisma";
import type { NewsCategory } from "@prisma/client";

export function getLatestNews(limit = 4) {
  return prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export function getNewsList(category?: NewsCategory) {
  return prisma.news.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { publishedAt: "desc" },
  });
}

export function getNewsBySlug(slug: string) {
  return prisma.news.findUnique({
    where: { slug },
    include: { author: { select: { name: true, image: true } } },
  });
}
