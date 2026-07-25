import Link from "next/link";
import {
  LayoutDashboardIcon,
  MessageSquareIcon,
  SettingsIcon,
  ShieldIcon,
  StarIcon,
  UserCogIcon,
} from "lucide-react";

import { ROLE_LABELS } from "@/lib/labels";
import type { UserRole } from "@prisma/client";

const BASE_LINKS = [{ href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboardIcon }];

const ROLE_LINKS: Partial<Record<UserRole, { href: string; label: string; icon: typeof UserCogIcon }[]>> = {
  PLAYER: [{ href: "/dashboard/profil", label: "Mon profil", icon: UserCogIcon }],
  CLUB: [{ href: "/dashboard/profil", label: "Mon club", icon: UserCogIcon }],
  RECRUITER: [{ href: "/favoris", label: "Favoris", icon: StarIcon }],
};

export function DashboardSidebar({ role, name }: { role: UserRole; name: string }) {
  const links = [
    ...BASE_LINKS,
    ...(ROLE_LINKS[role] ?? []),
    { href: "/messages", label: "Messagerie", icon: MessageSquareIcon },
    { href: "/parametres", label: "Paramètres", icon: SettingsIcon },
    ...(role === "ADMIN" ? [{ href: "/admin", label: "Administration", icon: ShieldIcon }] : []),
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-border pb-4 lg:w-60 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
      <div className="mb-4 hidden lg:block">
        <p className="text-xs text-muted-foreground">Connecté en tant que</p>
        <p className="font-display font-semibold">{name}</p>
        <p className="text-xs text-accent">{ROLE_LABELS[role]}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
