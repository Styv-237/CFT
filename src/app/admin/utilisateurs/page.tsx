import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

import { AdminPageHeader } from "../_components/admin-page-header";
import { UserRow } from "./_components/user-row";

export const metadata: Metadata = { title: "Administration — Utilisateurs" };

export default async function AdminUsersPage() {
  const [users, clubs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.club.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Utilisateurs" description={`${users.length} compte(s)`} />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Club rattaché</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} clubs={clubs} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
