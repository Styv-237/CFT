"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "./guard";

const leagueSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateLeagueAdmin(leagueId: string, formData: FormData) {
  await requireAdmin();

  const parsed = leagueSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  await prisma.league.update({ where: { id: leagueId }, data: parsed.data });

  revalidatePath("/admin/championnats");
  revalidatePath("/championnats");
  return { success: true };
}
