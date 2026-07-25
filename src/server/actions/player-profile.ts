"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireOwnPlayer() {
  const session = await auth();
  if (!session?.user?.playerId) return null;
  return { userId: session.user.id, playerId: session.user.playerId };
}

const profileSchema = z.object({
  bio: z.string().max(2000).optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  availability: z.enum(["TRANSFER_AVAILABLE", "LOAN_AVAILABLE", "FREE_AGENT", "NOT_AVAILABLE"]),
  estimatedValue: z.coerce.number().min(0).optional(),
  contractEndDate: z.string().optional(),
});

export async function updatePlayerProfile(formData: FormData) {
  const ctx = await requireOwnPlayer();
  if (!ctx) return { error: "Non autorisé." };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { bio, photoUrl, coverUrl, availability, estimatedValue, contractEndDate } = parsed.data;

  await prisma.player.update({
    where: { id: ctx.playerId },
    data: {
      bio,
      photoUrl: photoUrl || undefined,
      coverUrl: coverUrl || undefined,
      availability,
      estimatedValue,
      contractEndDate: contractEndDate ? new Date(contractEndDate) : undefined,
    },
  });

  revalidatePath("/dashboard/profil");
  revalidatePath("/dashboard");
  return { success: true };
}

const videoSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  category: z.enum(["HIGHLIGHTS", "FULL_MATCH", "COMPILATION", "TRAINING", "INTERVIEW"]),
});

export async function addPlayerVideo(formData: FormData) {
  const ctx = await requireOwnPlayer();
  if (!ctx) return { error: "Non autorisé." };

  const parsed = videoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  await prisma.playerVideo.create({ data: { ...parsed.data, playerId: ctx.playerId } });
  revalidatePath("/dashboard/profil");
  return { success: true };
}

export async function deletePlayerVideo(videoId: string) {
  const ctx = await requireOwnPlayer();
  if (!ctx) return { error: "Non autorisé." };
  await prisma.playerVideo.deleteMany({ where: { id: videoId, playerId: ctx.playerId } });
  revalidatePath("/dashboard/profil");
  return { success: true };
}

const photoSchema = z.object({
  url: z.string().url(),
  category: z.enum(["PORTRAIT", "ACTION", "MATCH", "TRAINING", "NATIONAL_TEAM"]),
  caption: z.string().max(200).optional(),
});

export async function addPlayerPhoto(formData: FormData) {
  const ctx = await requireOwnPlayer();
  if (!ctx) return { error: "Non autorisé." };

  const parsed = photoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  await prisma.playerPhoto.create({ data: { ...parsed.data, playerId: ctx.playerId } });
  revalidatePath("/dashboard/profil");
  return { success: true };
}

export async function deletePlayerPhoto(photoId: string) {
  const ctx = await requireOwnPlayer();
  if (!ctx) return { error: "Non autorisé." };
  await prisma.playerPhoto.deleteMany({ where: { id: photoId, playerId: ctx.playerId } });
  revalidatePath("/dashboard/profil");
  return { success: true };
}
