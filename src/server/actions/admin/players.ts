"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "./guard";

export async function setPlayerStatus(
  playerId: string,
  status: "APPROVED" | "REJECTED" | "PENDING"
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  await prisma.player.update({ where: { id: playerId }, data: { status } });
  revalidatePath("/admin/joueurs");
  revalidatePath("/joueurs");
  return { success: true };
}

export async function toggleFeaturedPlayer(
  playerId: string,
  featured: boolean
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  await prisma.player.update({ where: { id: playerId }, data: { featured } });
  revalidatePath("/admin/joueurs");
  revalidatePath("/");
  return { success: true };
}

export async function deletePlayerAdmin(playerId: string): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/admin/joueurs");
  revalidatePath("/joueurs");
  return { success: true };
}

const updateSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  nationality: z.string().min(2),
  heightCm: z.coerce.number().optional(),
  weightKg: z.coerce.number().optional(),
  estimatedValue: z.coerce.number().optional(),
  clubId: z.string().optional(),
  bio: z.string().optional(),
});

export async function updatePlayerAdmin(playerId: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { clubId, ...rest } = parsed.data;

  await prisma.player.update({
    where: { id: playerId },
    data: { ...rest, clubId: clubId || null },
  });

  revalidatePath("/admin/joueurs");
  revalidatePath("/joueurs");
  return { success: true };
}
