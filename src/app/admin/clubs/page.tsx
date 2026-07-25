import type { Metadata } from "next";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

import { AdminPageHeader } from "../_components/admin-page-header";
import { DeleteClubButton } from "./_components/delete-club-button";

export const metadata: Metadata = { title: "Administration — Clubs" };

export default async function AdminClubsPage() {
  const clubs = await prisma.club.findMany({
    include: { league: true, _count: { select: { players: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Clubs"
        description={`${clubs.length} club(s)`}
        action={
          <Button asChild className="gap-2">
            <Link href="/admin/clubs/nouveau">
              <PlusIcon className="size-4" /> Nouveau club
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Nom</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Championnat</TableHead>
              <TableHead>Effectif</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell className="pl-6 font-medium">{club.name}</TableCell>
                <TableCell className="text-muted-foreground">{club.city}</TableCell>
                <TableCell className="text-muted-foreground">{club.league?.name ?? "—"}</TableCell>
                <TableCell>{club._count.players}</TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/clubs/${club.id}`}>
                        <PencilIcon className="size-4" />
                      </Link>
                    </Button>
                    <DeleteClubButton clubId={club.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
