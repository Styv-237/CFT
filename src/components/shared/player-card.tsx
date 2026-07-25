import Image from "next/image";
import Link from "next/link";
import { RulerIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AVAILABILITY_BADGE_VARIANT, AVAILABILITY_LABELS, POSITION_LABELS } from "@/lib/labels";
import { calculateAge, formatCurrency } from "@/lib/utils";
import type { PlayerCard as PlayerCardData } from "@/server/queries/players";

export function PlayerCard({ player }: { player: PlayerCardData }) {
  return (
    <Link href={`/joueurs/${player.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          {player.photoUrl && (
            <Image
              src={player.photoUrl}
              alt={`${player.firstName} ${player.lastName}`}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur">
              {POSITION_LABELS[player.position]}
            </Badge>
          </div>
          {player.availability !== "NOT_AVAILABLE" && (
            <Badge
              variant={AVAILABILITY_BADGE_VARIANT[player.availability]}
              className="absolute top-3 right-3 bg-background/90 backdrop-blur"
            >
              {AVAILABILITY_LABELS[player.availability]}
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-white">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {player.club?.logoUrl && (
                <Image
                  src={player.club.logoUrl}
                  alt={player.club.name}
                  width={16}
                  height={16}
                  className="size-4 rounded-full bg-white/80"
                />
              )}
              <span className="max-w-24 truncate">{player.club?.shortName ?? player.club?.name ?? "Libre"}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div>
            <h3 className="font-display truncate text-base font-semibold">
              {player.firstName} {player.lastName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {calculateAge(player.birthDate)} ans · {player.nationality}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2.5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <RulerIcon className="size-3.5" />
              {player.heightCm ? `${player.heightCm} cm` : "N/C"}
            </div>
            <span className="font-display text-sm font-bold text-primary dark:text-accent">
              {formatCurrency(player.estimatedValue)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
