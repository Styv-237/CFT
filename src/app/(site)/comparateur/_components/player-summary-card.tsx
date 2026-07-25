import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { POSITION_LABELS } from "@/lib/labels";
import { calculateAge, formatCurrency } from "@/lib/utils";
import type { PlayerProfile } from "@/server/queries/players";

export function PlayerSummaryCard({ player }: { player: PlayerProfile }) {
  return (
    <Link
      href={`/joueurs/${player.slug}`}
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative size-24 overflow-hidden rounded-full bg-muted">
        {player.photoUrl && <Image src={player.photoUrl} alt="" fill className="object-cover" />}
      </div>
      <div>
        <p className="font-display text-lg font-semibold">
          {player.firstName} {player.lastName}
        </p>
        <p className="text-xs text-muted-foreground">
          {POSITION_LABELS[player.position]} · {player.club?.name ?? "Libre"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{calculateAge(player.birthDate)} ans</Badge>
        <Badge variant="gold">{formatCurrency(player.estimatedValue)}</Badge>
      </div>
    </Link>
  );
}
