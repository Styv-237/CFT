"use client";

import * as React from "react";
import { toast } from "sonner";
import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { markConversationRead, sendMessage } from "@/server/actions/messages";
import type { Message } from "@prisma/client";

export function MessageThread({
  messages,
  currentUserId,
  otherUserId,
}: {
  messages: Message[];
  currentUserId: string;
  otherUserId: string;
}) {
  const [content, setContent] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    markConversationRead(otherUserId);
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [otherUserId, messages.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-border p-4">
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                isMine ? "self-end bg-primary text-primary-foreground" : "self-start bg-secondary"
              )}
            >
              {message.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!content.trim()) return;
          startTransition(async () => {
            const result = await sendMessage(otherUserId, content);
            if (result.error) toast.error(result.error);
            else setContent("");
          });
        }}
        className="flex items-end gap-2"
      >
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre message…"
          rows={2}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending} size="icon">
          <SendIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
