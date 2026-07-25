import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { ROLE_LABELS } from "@/lib/labels";
import { initials } from "@/lib/utils";
import { getConversations } from "@/server/queries/messages";

export const metadata: Metadata = { title: "Messagerie" };

export default async function MessagesPage() {
  const session = await auth();
  const conversations = await getConversations(session!.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Messagerie</h1>
        <p className="text-sm text-muted-foreground">Vos échanges avec les recruteurs, clubs et joueurs.</p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <MessageSquareIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Aucune conversation pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
          {conversations.map((conv) => (
            <Link
              key={conv.user.id}
              href={`/messages/${conv.user.id}`}
              className="flex items-center gap-3 p-4 transition-colors hover:bg-secondary/60"
            >
              <Avatar>
                <AvatarImage src={conv.user.image ?? undefined} />
                <AvatarFallback>{initials(conv.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{conv.user.name}</p>
                  <Badge variant="outline" className="text-[0.65rem]">
                    {ROLE_LABELS[conv.user.role]}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{conv.lastMessage.content}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
                  {conv.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
