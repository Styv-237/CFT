"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireOwnClub() {
  const session = await auth();
  if (!session?.user?.clubId) return null;
  return session.user.clubId;
}

const clubSchema = z.object({
  description: z.string().max(3000).optional(),
  coachName: z.string().max(120).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateClub(formData: FormData) {
  const clubId = await requireOwnClub();
  if (!clubId) return { error: "Non autorisé." };

  const parsed = clubSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { description, coachName, logoUrl, coverUrl } = parsed.data;
  await prisma.club.update({
    where: { id: clubId },
    data: { description, coachName, logoUrl: logoUrl || undefined, coverUrl: coverUrl || undefined },
  });

  revalidatePath("/dashboard/profil");
  revalidatePath("/clubs");
  return { success: true };
}

const addPlayerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  birthDate: z.string().min(4),
  position: z.enum([
    "GOALKEEPER",
    "CENTER_BACK",
    "LEFT_BACK",
    "RIGHT_BACK",
    "DEFENSIVE_MIDFIELD",
    "CENTER_MIDFIELD",
    "ATTACKING_MIDFIELD",
    "LEFT_WINGER",
    "RIGHT_WINGER",
    "STRIKER",
  ]),
  nationality: z.string().min(2).default("Cameroun"),
});

export async function addClubPlayer(formData: FormData) {
  const clubId = await requireOwnClub();
  if (!clubId) return { error: "Non autorisé." };

  const parsed = addPlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { firstName, lastName, birthDate, position, nationality } = parsed.data;
  const playerSlug = slugify(`${firstName}-${lastName}-${Date.now()}`, { lower: true, strict: true });

  await prisma.player.create({
    data: {
      slug: playerSlug,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      position,
      nationality,
      clubId,
      status: "APPROVED",
    },
  });

  revalidatePath("/dashboard/profil");
  revalidatePath("/joueurs");
  return { success: true };
}

export async function removeClubPlayer(playerId: string) {
  const clubId = await requireOwnClub();
  if (!clubId) return { error: "Non autorisé." };

  await prisma.player.updateMany({
    where: { id: playerId, clubId },
    data: { clubId: null, availability: "FREE_AGENT" },
  });

  revalidatePath("/dashboard/profil");
  revalidatePath("/joueurs");
  return { success: true };
}
