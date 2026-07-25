"use client";

import * as React from "react";
import Link from "next/link";
import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { markAllNotificationsRead, markNotificationRead } from "@/server/actions/notifications";
import type { Notification } from "@prisma/client";

function timeAgo(date: Date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <BellIcon className="size-[1.1rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-destructive" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs text-primary hover:underline dark:text-accent"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted-foreground">Aucune notification.</p>
        ) : (
          <div className="flex max-h-80 flex-col overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-0.5 whitespace-normal"
                onClick={() => !notification.read && markNotificationRead(notification.id)}
                asChild
              >
                <Link href={notification.link ?? "#"}>
                  <span className="flex w-full items-center gap-1.5 text-sm font-medium">
                    {!notification.read && <Badge className="size-1.5 rounded-full p-0" />}
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{notification.message}</span>
                  <span className="text-[0.65rem] text-muted-foreground">{timeAgo(notification.createdAt)}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
