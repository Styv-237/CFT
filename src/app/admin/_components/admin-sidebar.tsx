import Link from "next/link";
import {
  LayoutDashboardIcon,
  NewspaperIcon,
  ShieldIcon,
  TrophyIcon,
  UsersIcon,
  UserRoundIcon,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboardIcon },
  { href: "/admin/joueurs", label: "Joueurs", icon: UserRoundIcon },
  { href: "/admin/clubs", label: "Clubs", icon: ShieldIcon },
  { href: "/admin/championnats", label: "Championnats", icon: TrophyIcon },
  { href: "/admin/actualites", label: "Actualités", icon: NewspaperIcon },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: UsersIcon },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-border pb-4 lg:w-60 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
      <div className="mb-4 hidden lg:block">
        <p className="font-display font-semibold">Back-office</p>
        <p className="text-xs text-muted-foreground">Administration CFT</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {LINKS.map((link) => (
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
