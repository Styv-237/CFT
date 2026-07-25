"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "./guard";

const clubSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  stadiumName: z.string().optional(),
  stadiumCapacity: z.coerce.number().optional(),
  foundedYear: z.coerce.number().optional(),
  coachName: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  leagueId: z.string().optional(),
});

export async function createClubAdmin(formData: FormData) {
  await requireAdmin();

  const parsed = clubSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { leagueId, ...rest } = parsed.data;
  const club = await prisma.club.create({
    data: { ...rest, slug: slugify(`${rest.name}-${Date.now()}`, { lower: true, strict: true }), leagueId: leagueId || null },
  });

  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
  redirect(`/admin/clubs/${club.id}`);
}

export async function updateClubAdmin(clubId: string, formData: FormData) {
  await requireAdmin();

  const parsed = clubSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const { leagueId, ...rest } = parsed.data;
  await prisma.club.update({ where: { id: clubId }, data: { ...rest, leagueId: leagueId || null } });

  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
  return { success: true };
}

export async function deleteClubAdmin(clubId: string): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  await prisma.club.delete({ where: { id: clubId } });
  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
  return { success: true };
}
