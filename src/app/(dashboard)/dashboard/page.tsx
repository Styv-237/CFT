import type { Metadata } from "next";
import Link from "next/link";
import {
  ClockIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { getGlobalStats } from "@/server/queries/stats";

export const metadata: Metadata = { title: "Tableau de bord" };

async function StatTile({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof UsersIcon }) {
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

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user;

  const unreadMessages = await prisma.message.count({ where: { receiverId: user.id, read: false } });

  if (user.role === "ADMIN") {
    const stats = await getGlobalStats();
    const pendingPlayers = await prisma.player.count({ where: { status: "PENDING" } });

    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Bonjour {user.name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">Voici un aperçu global de la plateforme.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="Joueurs" value={stats.players} icon={UsersIcon} />
          <StatTile label="Clubs" value={stats.clubs} icon={ShieldCheckIcon} />
          <StatTile label="Recruteurs" value={stats.recruiters} icon={UsersIcon} />
          <StatTile label="Vidéos" value={stats.videos} icon={TrendingUpIcon} />
          <StatTile label="Matchs" value={stats.matches} icon={ClockIcon} />
          <StatTile label="Buts" value={stats.goals} icon={TrendingUpIcon} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Actions requises</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pb-6">
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <span className="text-sm">
                <strong>{pendingPlayers}</strong> profil{pendingPlayers > 1 ? "s" : ""} joueur en attente d&apos;approbation
              </span>
              <Button size="sm" asChild>
                <Link href="/admin/joueurs?statut=PENDING">Vérifier</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <span className="text-sm">Gérer l&apos;ensemble des contenus de la plateforme</span>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin">Back-office</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role === "CLUB") {
    const club = user.clubId
      ? await prisma.club.findUnique({
          where: { id: user.clubId },
          include: { _count: { select: { players: true } } },
        })
      : null;

    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Bonjour {user.name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">
            {club ? `Espace de gestion de ${club.name}` : "Aucun club ne vous est encore rattaché."}
          </p>
        </div>
        {club ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatTile label="Effectif" value={club._count.players} icon={UsersIcon} />
            <StatTile label="Messages non lus" value={unreadMessages} icon={MessageSquareIcon} />
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Contactez l&apos;administration pour rattacher votre compte à un club.
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 pb-6">
            <Button asChild>
              <Link href="/dashboard/profil">Gérer mon effectif</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/messages">Messagerie</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role === "PLAYER") {
    const player = user.playerId
      ? await prisma.player.findUnique({
          where: { id: user.playerId },
          include: { statistics: { orderBy: { season: { startDate: "desc" } }, take: 1 }, videos: true, photos: true },
        })
      : null;

    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Bonjour {user.name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">Voici l&apos;état de votre profil sur CFT.</p>
        </div>
        {player && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile label="Statut" value={player.status === "APPROVED" ? "Approuvé" : "En attente"} icon={ShieldCheckIcon} />
            <StatTile label="Valeur estimée" value={formatCurrency(player.estimatedValue)} icon={TrendingUpIcon} />
            <StatTile label="Vidéos" value={player.videos.length} icon={TrendingUpIcon} />
            <StatTile label="Photos" value={player.photos.length} icon={TrendingUpIcon} />
          </div>
        )}
        {player?.status === "PENDING" && (
          <Badge variant="warning" className="w-fit">
            Votre profil est en attente d&apos;approbation par un administrateur
          </Badge>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Complétez votre profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 pb-6">
            <Button asChild>
              <Link href="/dashboard/profil">Modifier mon profil</Link>
            </Button>
            {player && (
              <Button variant="outline" asChild>
                <Link href={`/joueurs/${player.slug}`}>Voir mon profil public</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // RECRUITER / AGENT
  const favoritesCount = await prisma.favorite.count({ where: { recruiterId: user.id } });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Bonjour {user.name?.split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground">Retrouvez vos favoris et vos échanges.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile label="Joueurs favoris" value={favoritesCount} icon={StarIcon} />
        <StatTile label="Messages non lus" value={unreadMessages} icon={MessageSquareIcon} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 pb-6">
          <Button asChild>
            <Link href="/recherche">Recherche avancée</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/comparateur">Comparateur</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/favoris">Mes favoris</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
