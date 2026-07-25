"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function sendMessage(receiverId: string, content: string) {
  const session = await auth();
  if (!session?.user) return { error: "Vous devez être connecté pour envoyer un message." };
  if (!content.trim()) return { error: "Le message ne peut pas être vide." };
  if (receiverId === session.user.id) return { error: "Vous ne pouvez pas vous envoyer un message." };

  await prisma.message.create({
    data: { senderId: session.user.id, receiverId, content: content.trim() },
  });

  revalidatePath("/messages");
  return { success: true };
}

export async function markConversationRead(otherUserId: string) {
  const session = await auth();
  if (!session?.user) return;

  await prisma.message.updateMany({
    where: { senderId: otherUserId, receiverId: session.user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/messages");
}
