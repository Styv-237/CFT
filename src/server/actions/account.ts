"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const nameSchema = z.object({ name: z.string().min(2, "Le nom doit contenir au moins 2 caractères") });

export async function updateAccountName(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };

  const parsed = nameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  await prisma.user.update({ where: { id: session.user.id }, data: { name: parsed.data.name } });
  revalidatePath("/parametres");
  return { success: true };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  });

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { success: true };
}
