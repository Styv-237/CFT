import { UsersIcon, ShieldIcon, SearchIcon, VideoIcon, CalendarIcon, GoalIcon } from "lucide-react";

import { StatCounter } from "@/components/shared/stat-counter";
import { getGlobalStats } from "@/server/queries/stats";

export async function GlobalStats() {
  const stats = await getGlobalStats();

  const items = [
    { label: "Joueurs référencés", value: stats.players, icon: UsersIcon },
    { label: "Clubs partenaires", value: stats.clubs, icon: ShieldIcon },
    { label: "Recruteurs actifs", value: stats.recruiters, icon: SearchIcon },
    { label: "Vidéos disponibles", value: stats.videos, icon: VideoIcon },
    { label: "Matchs suivis", value: stats.matches, icon: CalendarIcon },
    { label: "Buts marqués", value: stats.goals, icon: GoalIcon },
  ];

  return (
    <section className="border-b border-border bg-secondary/40 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <item.icon className="size-5 text-accent" />
            <span className="font-display text-3xl font-bold">
              <StatCounter value={item.value} suffix="+" />
            </span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
