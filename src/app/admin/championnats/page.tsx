import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";

import { AdminPageHeader } from "../_components/admin-page-header";
import { LeagueEditCard } from "./_components/league-edit-card";

export const metadata: Metadata = { title: "Administration — Championnats" };

export default async function AdminLeaguesPage() {
  const leagues = await prisma.league.findMany({ orderBy: { tier: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Championnats" description="Elite One, Elite Two et Coupe du Cameroun" />
      <div className="grid gap-6 lg:grid-cols-3">
        {leagues.map((league) => (
          <LeagueEditCard key={league.id} league={league} />
        ))}
      </div>
    </div>
  );
}
