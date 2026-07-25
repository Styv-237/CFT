"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(playerId: string, playerSlug: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Vous devez être connecté pour ajouter un favori." };
  }
  if (session.user.role !== "RECRUITER" && session.user.role !== "AGENT" && session.user.role !== "ADMIN") {
    return { error: "Seuls les recruteurs peuvent gérer des favoris." };
  }

  const existing = await prisma.favorite.findUnique({
    where: { recruiterId_playerId: { recruiterId: session.user.id, playerId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath(`/joueurs/${playerSlug}`);
    revalidatePath("/favoris");
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { recruiterId: session.user.id, playerId } });
  revalidatePath(`/joueurs/${playerSlug}`);
  revalidatePath("/favoris");
  return { favorited: true };
}
