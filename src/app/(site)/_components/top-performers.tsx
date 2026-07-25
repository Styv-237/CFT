import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTopAssists, getTopScorers } from "@/server/queries/players";

function PerformerList({
  title,
  icon,
  performers,
  metric,
}: {
  title: string;
  icon: string;
  performers: Awaited<ReturnType<typeof getTopScorers>>;
  metric: "goals" | "assists";
}) {
  const max = Math.max(...performers.map((p) => p[metric]), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden>{icon}</span> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-6">
        {performers.map((entry, i) => (
          <Link
            key={entry.player.id}
            href={`/joueurs/${entry.player.slug}`}
            className="flex items-center gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-secondary"
          >
            <span className="w-5 shrink-0 text-center text-sm font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
              {entry.player.photoUrl && (
                <Image src={entry.player.photoUrl} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {entry.player.firstName} {entry.player.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {entry.player.club?.shortName ?? entry.player.club?.name ?? "Libre"}
              </p>
              <Progress value={(entry[metric] / max) * 100} className="mt-1.5 h-1" />
            </div>
            <span className="font-display shrink-0 text-lg font-bold text-primary dark:text-accent">
              {entry[metric]}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export async function TopPerformers() {
  const [scorers, assists] = await Promise.all([getTopScorers(6), getTopAssists(6)]);
  if (scorers.length === 0 && assists.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Saison en cours"
          title="Meilleurs buteurs & passeurs"
          description="Les statistiques clés de la saison en Elite One, mises à jour en continu."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PerformerList title="Meilleurs buteurs" icon="⚽" performers={scorers} metric="goals" />
          <PerformerList title="Meilleurs passeurs" icon="🎯" performers={assists} metric="assists" />
        </div>
      </div>
    </section>
  );
}
