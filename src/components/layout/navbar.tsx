import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { prisma } from "@/lib/prisma";

export async function Navbar() {
  const session = await auth();

  const notifications = session?.user
    ? await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 15,
      })
    : [];

  const authArea = session?.user ? (
    <UserMenu user={session.user} />
  ) : (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/connexion">Connexion</Link>
      </Button>
      <Button variant="gold" asChild>
        <Link href="/inscription">Inscription</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <MobileNav authArea={authArea} />
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          {session?.user && <NotificationBell notifications={notifications} />}
          <ThemeToggle />
          <div className="hidden md:block">{authArea}</div>
        </div>
      </div>
    </header>
  );
}
