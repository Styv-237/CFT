import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getConversationMessages } from "@/server/queries/messages";

import { MessageThread } from "./_components/message-thread";

export const metadata: Metadata = { title: "Conversation" };

export default async function ConversationPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: otherUserId } = await params;
  const session = await auth();
  const currentUserId = session!.user.id;

  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId }, select: { name: true } });
  if (!otherUser) notFound();

  const messages = await getConversationMessages(currentUserId, otherUserId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/messages" className="text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-5" />
        </Link>
        <h1 className="font-display text-xl font-bold">{otherUser.name}</h1>
      </div>
      <MessageThread messages={messages} currentUserId={currentUserId} otherUserId={otherUserId} />
    </div>
  );
}
