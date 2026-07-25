import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { POSITION_LABELS } from "@/lib/labels";
import { calculateAge, formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

import { AdminPageHeader } from "../_components/admin-page-header";
import { PlayerRowActions } from "./_components/player-row-actions";

export const metadata: Metadata = { title: "Administration — Joueurs" };

const STATUS_LABELS: Record<string, string> = { PENDING: "En attente", APPROVED: "Approuvé", REJECTED: "Rejeté" };
const STATUS_VARIANTS: Record<string, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

export default async function AdminPlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;

  const players = await prisma.player.findMany({
    where: statut ? { status: statut as "PENDING" | "APPROVED" | "REJECTED" } : undefined,
    include: { club: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Joueurs" description={`${players.length} profil(s) affiché(s)`} />

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/joueurs">
          <Badge variant={!statut ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            Tous
          </Badge>
        </Link>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <Link key={value} href={`/admin/joueurs?statut=${value}`}>
            <Badge variant={statut === value ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Âge</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="pl-6 font-medium">
                  {player.firstName} {player.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">{POSITION_LABELS[player.position]}</TableCell>
                <TableCell className="text-muted-foreground">{player.club?.name ?? "Libre"}</TableCell>
                <TableCell>{calculateAge(player.birthDate)}</TableCell>
                <TableCell>{formatCurrency(player.estimatedValue)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[player.status]}>{STATUS_LABELS[player.status]}</Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <PlayerRowActions playerId={player.id} status={player.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
