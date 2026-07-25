"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Club, League } from "@prisma/client";

export function ClubForm({
  club,
  leagues,
  action,
}: {
  club?: Club;
  leagues: League[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await action(formData);
          if (result?.error) toast.error(result.error);
          else {
            toast.success(club ? "Club mis à jour" : "Club créé");
            router.refresh();
          }
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nom du club</Label>
          <Input id="name" name="name" defaultValue={club?.name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" defaultValue={club?.city} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stadiumName">Stade</Label>
          <Input id="stadiumName" name="stadiumName" defaultValue={club?.stadiumName ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stadiumCapacity">Capacité</Label>
          <Input id="stadiumCapacity" name="stadiumCapacity" type="number" defaultValue={club?.stadiumCapacity ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="foundedYear">Année de fondation</Label>
          <Input id="foundedYear" name="foundedYear" type="number" defaultValue={club?.foundedYear ?? ""} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coachName">Entraîneur</Label>
          <Input id="coachName" name="coachName" defaultValue={club?.coachName ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Championnat</Label>
          <Select name="leagueId" defaultValue={club?.leagueId ?? "none"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              {leagues.map((league) => (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="logoUrl">URL du logo</Label>
          <Input id="logoUrl" name="logoUrl" defaultValue={club?.logoUrl ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coverUrl">URL de la couverture</Label>
          <Input id="coverUrl" name="coverUrl" defaultValue={club?.coverUrl ?? ""} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Historique / Description</Label>
        <Textarea id="description" name="description" defaultValue={club?.description ?? ""} rows={4} />
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {club ? "Enregistrer les modifications" : "Créer le club"}
      </Button>
    </form>
  );
}
