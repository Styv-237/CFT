import Image from "next/image";
import Link from "next/link";
import { DownloadIcon, ScaleIcon, ShirtIcon, SplitSquareHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { auth } from "@/auth";
import { AVAILABILITY_BADGE_VARIANT, AVAILABILITY_LABELS, POSITION_LABELS } from "@/lib/labels";
import { calculateAge, formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getPlayerContactReceiverId, type PlayerProfile } from "@/server/queries/players";

import { ContactDialog } from "./contact-dialog";

export async function PlayerHeader({ player }: { player: PlayerProfile }) {
  const session = await auth();

  const [favorite, receiverId] = await Promise.all([
    session?.user
      ? prisma.favorite.findUnique({
          where: { recruiterId_playerId: { recruiterId: session.user.id, playerId: player.id } },
        })
      : null,
    getPlayerContactReceiverId(player),
  ]);

  const canFavorite = !!session?.user;
  const age = calculateAge(player.birthDate);

  return (
    <div className="relative">
      <div className="relative h-56 w-full overflow-hidden bg-primary sm:h-72">
        {player.coverUrl && (
          <Image src={player.coverUrl} alt="" fill priority className="object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative -mt-20 size-36 shrink-0 overflow-hidden rounded-3xl border-4 border-background bg-muted shadow-lg sm:-mt-24 sm:size-44">
            {player.photoUrl && (
              <Image src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} fill className="object-cover" />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{POSITION_LABELS[player.position]}</Badge>
              {player.availability !== "NOT_AVAILABLE" && (
                <Badge variant={AVAILABILITY_BADGE_VARIANT[player.availability]}>
                  {AVAILABILITY_LABELS[player.availability]}
                </Badge>
              )}
              {player.shirtNumber && (
                <Badge variant="outline" className="gap-1">
                  <ShirtIcon className="size-3" /> N°{player.shirtNumber}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {player.firstName} {player.lastName}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                <span>{age} ans</span>
                <span aria-hidden>·</span>
                <span>{player.nationality}</span>
                {player.club && (
                  <>
                    <span aria-hidden>·</span>
                    <Link href={`/clubs/${player.club.slug}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      {player.club.logoUrl && (
                        <Image src={player.club.logoUrl} alt="" width={16} height={16} className="size-4 rounded-full" />
                      )}
                      {player.club.name}
                    </Link>
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ScaleIcon className="size-4" />
                {player.heightCm ? `${player.heightCm} cm` : "N/C"} · {player.weightKg ? `${player.weightKg} kg` : "N/C"}
              </span>
              <span className="font-display text-xl font-bold text-primary dark:text-accent">
                {formatCurrency(player.estimatedValue)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-1">
            <FavoriteButton
              playerId={player.id}
              playerSlug={player.slug}
              initialFavorited={!!favorite}
              canFavorite={canFavorite}
            />
            <ContactDialog
              receiverId={receiverId}
              playerName={`${player.firstName} ${player.lastName}`}
              canContact={canFavorite}
              playerSlug={player.slug}
            />
            <Button variant="outline" className="gap-2" asChild>
              <Link href={`/comparateur?a=${player.slug}`}>
                <SplitSquareHorizontalIcon className="size-4" />
                Comparer
              </Link>
            </Button>
            <Button variant="gold" className="gap-2" asChild>
              <a href={`/api/joueurs/${player.slug}/cv`} target="_blank" rel="noopener noreferrer">
                <DownloadIcon className="size-4" />
                CV sportif
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
