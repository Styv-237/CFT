"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "./guard";

const roleSchema = z.object({
  role: z.enum(["ADMIN", "PLAYER", "CLUB", "RECRUITER", "AGENT", "ACADEMY"]),
  clubId: z.string().optional(),
});

export async function updateUserRoleAdmin(userId: string, formData: FormData) {
  await requireAdmin();

  const parsed = roleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Données invalides." };

  const role = parsed.data.role as UserRole;
  await prisma.user.update({
    where: { id: userId },
    data: { role, clubId: role === "CLUB" ? parsed.data.clubId || null : null },
  });

  revalidatePath("/admin/utilisateurs");
  return { success: true };
}

export async function deleteUserAdmin(userId: string): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/utilisateurs");
  return { success: true };
}
