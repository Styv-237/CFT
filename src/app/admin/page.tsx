import type { Metadata } from "next";
import Link from "next/link";
import { NewspaperIcon, ShieldIcon, TrendingUpIcon, UserRoundIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getGlobalStats } from "@/server/queries/stats";

import { AdminPageHeader } from "./_components/admin-page-header";

export const metadata: Metadata = { title: "Administration" };

function Tile({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof UsersIcon }) {
  return (
    <Card className="gap-2 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="size-4 text-accent" />
      </div>
      <span className="font-display text-2xl font-bold">{value}</span>
    </Card>
  );
}

export default async function AdminOverviewPage() {
  const [stats, pendingPlayers, unpublishedNews, totalUsers] = await Promise.all([
    getGlobalStats(),
    prisma.player.count({ where: { status: "PENDING" } }),
    prisma.news.count({ where: { published: false } }),
    prisma.user.count(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Vue d'ensemble" description="Administration de la plateforme CFT." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Tile label="Joueurs" value={stats.players} icon={UserRoundIcon} />
        <Tile label="Clubs" value={stats.clubs} icon={ShieldIcon} />
        <Tile label="Utilisateurs" value={totalUsers} icon={UsersIcon} />
        <Tile label="Vidéos" value={stats.videos} icon={TrendingUpIcon} />
        <Tile label="Matchs" value={stats.matches} icon={TrendingUpIcon} />
        <Tile label="Buts" value={stats.goals} icon={TrendingUpIcon} />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 py-6">
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
            <span className="flex items-center gap-2 text-sm">
              <UserRoundIcon className="size-4 text-muted-foreground" />
              <strong>{pendingPlayers}</strong> profil{pendingPlayers > 1 ? "s" : ""} joueur en attente
            </span>
            <Button size="sm" asChild>
              <Link href="/admin/joueurs?statut=PENDING">Traiter</Link>
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
            <span className="flex items-center gap-2 text-sm">
              <NewspaperIcon className="size-4 text-muted-foreground" />
              <strong>{unpublishedNews}</strong> article{unpublishedNews > 1 ? "s" : ""} non publié
              {unpublishedNews > 1 ? "s" : ""}
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/actualites">Gérer</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
