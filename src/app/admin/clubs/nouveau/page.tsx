import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createClubAdmin } from "@/server/actions/admin/clubs";

import { AdminPageHeader } from "../../_components/admin-page-header";
import { ClubForm } from "../_components/club-form";

export const metadata: Metadata = { title: "Nouveau club" };

export default async function NewClubPage() {
  const leagues = await prisma.league.findMany({ orderBy: { tier: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Nouveau club" description="Ajouter un club à la plateforme" />
      <Card>
        <CardContent className="py-6">
          <ClubForm leagues={leagues} action={createClubAdmin} />
        </CardContent>
      </Card>
    </div>
  );
}
