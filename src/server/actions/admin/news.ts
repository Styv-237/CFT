"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "./guard";

const newsSchema = z.object({
  title: z.string().min(4),
  excerpt: z.string().min(4),
  content: z.string().min(10),
  category: z.enum(["TRANSFERTS", "PERFORMANCES", "SELECTIONS", "BLESSURES", "ACADEMIES", "INTERVIEWS"]),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  published: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function createNewsAdmin(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { published, ...rest } = parsed.data;
  const isPublished = published === "on";

  const article = await prisma.news.create({
    data: {
      ...rest,
      slug: slugify(`${rest.title}-${Date.now()}`, { lower: true, strict: true }),
      authorId: admin.id,
      published: isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  redirect(`/admin/actualites/${article.id}`);
}

export async function updateNewsAdmin(newsId: string, formData: FormData) {
  await requireAdmin();

  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { published, ...rest } = parsed.data;
  const isPublished = published === "on";
  const existing = await prisma.news.findUnique({ where: { id: newsId }, select: { publishedAt: true } });

  await prisma.news.update({
    where: { id: newsId },
    data: {
      ...rest,
      published: isPublished,
      publishedAt: isPublished ? (existing?.publishedAt ?? new Date()) : null,
    },
  });

  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  return { success: true };
}

export async function deleteNewsAdmin(newsId: string): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  await prisma.news.delete({ where: { id: newsId } });
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  return { success: true };
}
