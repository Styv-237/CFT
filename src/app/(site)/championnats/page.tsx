import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrophyIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllLeagues } from "@/server/queries/leagues";

export const metadata: Metadata = {
  title: "Championnats",
  description: "Elite One, Elite Two et Coupe du Cameroun : classements, calendriers et statistiques.",
};

export default async function LeaguesPage() {
  const leagues = await getAllLeagues();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Compétitions" title="Championnats" description="Le football camerounais à travers ses compétitions officielles." />

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {leagues.map((league) => (
          <Link key={league.id} href={`/championnats/${league.slug}`}>
            <Card className="h-full gap-4 p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                {league.logoUrl ? (
                  <Image src={league.logoUrl} alt={league.name} width={56} height={56} className="size-14 rounded-full bg-secondary" />
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <TrophyIcon className="size-6" />
                  </span>
                )}
                <div>
                  <p className="font-display text-lg font-semibold">{league.name}</p>
                  <Badge variant="secondary">{league.type === "CUP" ? "Coupe" : "Championnat"}</Badge>
                </div>
              </div>
              {league.description && <p className="text-sm text-muted-foreground">{league.description}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
