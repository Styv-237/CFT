import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

import { AdminPageHeader } from "../../_components/admin-page-header";
import { EditPlayerForm } from "./_components/edit-player-form";

export const metadata: Metadata = { title: "Modifier un joueur" };

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [player, clubs] = await Promise.all([
    prisma.player.findUnique({ where: { id } }),
    prisma.club.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!player) notFound();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={`${player.firstName} ${player.lastName}`} description="Modifier le profil du joueur" />
      <Card>
        <CardContent className="py-6">
          <EditPlayerForm player={player} clubs={clubs} />
        </CardContent>
      </Card>
    </div>
  );
}
