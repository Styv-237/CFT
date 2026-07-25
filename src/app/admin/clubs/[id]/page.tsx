import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateClubAdmin } from "@/server/actions/admin/clubs";

import { AdminPageHeader } from "../../_components/admin-page-header";
import { ClubForm } from "../_components/club-form";

export const metadata: Metadata = { title: "Modifier un club" };

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [club, leagues] = await Promise.all([
    prisma.club.findUnique({ where: { id } }),
    prisma.league.findMany({ orderBy: { tier: "asc" } }),
  ]);

  if (!club) notFound();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={club.name} description="Modifier les informations du club" />
      <Card>
        <CardContent className="py-6">
          <ClubForm club={club} leagues={leagues} action={updateClubAdmin.bind(null, club.id)} />
        </CardContent>
      </Card>
    </div>
  );
}
