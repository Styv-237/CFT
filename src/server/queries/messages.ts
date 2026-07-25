import { prisma } from "@/lib/prisma";

export async function getConversations(userId: string) {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, role: true, image: true } },
      receiver: { select: { id: true, name: true, role: true, image: true } },
    },
  });

  const conversations = new Map<
    string,
    { user: (typeof messages)[number]["sender"]; lastMessage: (typeof messages)[number]; unread: number }
  >();

  for (const message of messages) {
    const other = message.senderId === userId ? message.receiver : message.sender;
    const existing = conversations.get(other.id);
    const isUnread = message.receiverId === userId && !message.read;

    if (!existing) {
      conversations.set(other.id, { user: other, lastMessage: message, unread: isUnread ? 1 : 0 });
    } else if (isUnread) {
      existing.unread += 1;
    }
  }

  return Array.from(conversations.values());
}

export function getConversationMessages(userId: string, otherUserId: string) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
}
