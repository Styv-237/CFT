"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROLE_LABELS } from "@/lib/labels";
import { deleteUserAdmin, updateUserRoleAdmin } from "@/server/actions/admin/users";
import type { User } from "@prisma/client";

export function UserRow({ user, clubs }: { user: User; clubs: { id: string; name: string }[] }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [role, setRole] = React.useState(user.role);
  const [clubId, setClubId] = React.useState(user.clubId ?? "");

  const applyRole = (newRole: typeof role, newClubId: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("role", newRole);
      if (newClubId) formData.set("clubId", newClubId);
      const result = await updateUserRoleAdmin(user.id, formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Rôle mis à jour");
        router.refresh();
      }
    });
  };

  return (
    <TableRow>
      <TableCell className="pl-6 font-medium">{user.name}</TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>
        <Select
          value={role}
          onValueChange={(v) => {
            const newRole = v as typeof role;
            setRole(newRole);
            applyRole(newRole, clubId);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {role === "CLUB" ? (
          <Select
            value={clubId || "none"}
            onValueChange={(v) => {
              const newClubId = v === "none" ? "" : v;
              setClubId(newClubId);
              applyRole(role, newClubId);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Aucun club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun club</SelectItem>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="pr-6 text-right">
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Supprimer cet utilisateur ?")) return;
            startTransition(async () => {
              const result = await deleteUserAdmin(user.id);
              if (result.error) toast.error(result.error);
              else {
                toast.success("Utilisateur supprimé");
                router.refresh();
              }
            });
          }}
        >
          <TrashIcon className="size-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
