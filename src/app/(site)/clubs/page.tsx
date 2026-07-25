import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, UsersIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllClubs } from "@/server/queries/clubs";

export const metadata: Metadata = {
  title: "Clubs",
  description: "Découvrez les clubs du football camerounais : effectifs, classement, stade et historique.",
};

export default async function ClubsPage() {
  const clubs = await getAllClubs();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Annuaire" title="Clubs" description="Les clubs qui font vivre le football camerounais." />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <Link key={club.id} href={`/clubs/${club.slug}`}>
            <Card className="h-full gap-3 p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                {club.logoUrl && (
                  <Image src={club.logoUrl} alt={club.name} width={48} height={48} className="size-12 rounded-full bg-secondary" />
                )}
                <div className="min-w-0">
                  <p className="font-display truncate font-semibold">{club.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPinIcon className="size-3" /> {club.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                {club.league && <Badge variant="secondary">{club.league.name}</Badge>}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <UsersIcon className="size-3.5" /> {club._count.players} joueurs
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
