"use server";

import bcrypt from "bcryptjs";
import slugify from "slugify";

import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  if (role === "PLAYER") {
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ") || firstName;
    const slugBase = slugify(`${firstName}-${lastName}-${user.id.slice(-6)}`, { lower: true, strict: true });

    await prisma.player.create({
      data: {
        slug: slugBase,
        firstName,
        lastName,
        birthDate: new Date(2000, 0, 1),
        nationality: "Cameroun",
        position: "CENTER_MIDFIELD",
        status: "PENDING",
        userId: user.id,
      },
    });
  }

  return { success: true };
}
