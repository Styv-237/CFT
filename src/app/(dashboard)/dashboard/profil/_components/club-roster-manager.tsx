"use client";

import * as React from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSITION_LABELS } from "@/lib/labels";
import { addClubPlayer, removeClubPlayer, updateClub } from "@/server/actions/club";
import type { Prisma } from "@prisma/client";

type ClubWithPlayers = Prisma.ClubGetPayload<{ include: { players: true } }>;

export function ClubRosterManager({ club }: { club: ClubWithPlayers }) {
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Informations du club</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await updateClub(formData);
                if (result.error) toast.error(result.error);
                else toast.success("Club mis à jour");
              });
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Historique / Description</Label>
              <Textarea id="description" name="description" defaultValue={club.description ?? ""} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="coachName">Entraîneur</Label>
                <Input id="coachName" name="coachName" defaultValue={club.coachName ?? ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="logoUrl">URL du logo</Label>
                <Input id="logoUrl" name="logoUrl" defaultValue={club.logoUrl ?? ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="coverUrl">URL de la couverture</Label>
                <Input id="coverUrl" name="coverUrl" defaultValue={club.coverUrl ?? ""} />
              </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-fit">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un joueur à l&apos;effectif</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await addClubPlayer(formData);
                if (result.error) toast.error(result.error);
                else toast.success("Joueur ajouté à l'effectif");
              });
            }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Input name="firstName" placeholder="Prénom" required />
            <Input name="lastName" placeholder="Nom" required />
            <Input name="birthDate" type="date" required />
            <Select name="position" defaultValue="CENTER_MIDFIELD">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(POSITION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input name="nationality" placeholder="Nationalité" defaultValue="Cameroun" />
            <Button type="submit" disabled={isPending} className="w-fit lg:col-span-4">
              Ajouter le joueur
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Effectif ({club.players.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pb-6">
          {club.players.map((player) => (
            <div key={player.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
              <span>
                {player.firstName} {player.lastName} — {POSITION_LABELS[player.position]}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  startTransition(async () => {
                    await removeClubPlayer(player.id);
                    toast.success("Joueur retiré de l'effectif");
                  })
                }
              >
                <TrashIcon className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
