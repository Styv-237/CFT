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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toggleFeaturedPlayer, updatePlayerAdmin } from "@/server/actions/admin/players";
import type { Player } from "@prisma/client";

export function EditPlayerForm({
  player,
  clubs,
}: {
  player: Player;
  clubs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [featured, setFeatured] = React.useState(player.featured);

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await updatePlayerAdmin(player.id, formData);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Joueur mis à jour");
            router.refresh();
          }
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" defaultValue={player.firstName} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" defaultValue={player.lastName} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nationality">Nationalité</Label>
          <Input id="nationality" name="nationality" defaultValue={player.nationality} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heightCm">Taille (cm)</Label>
          <Input id="heightCm" name="heightCm" type="number" defaultValue={player.heightCm ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weightKg">Poids (kg)</Label>
          <Input id="weightKg" name="weightKg" type="number" defaultValue={player.weightKg ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
          <Input id="estimatedValue" name="estimatedValue" type="number" defaultValue={player.estimatedValue ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Club</Label>
          <Select name="clubId" defaultValue={player.clubId ?? "none"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sans club</SelectItem>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Biographie</Label>
        <Textarea id="bio" name="bio" defaultValue={player.bio ?? ""} rows={4} />
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
        <Switch
          checked={featured}
          onCheckedChange={(checked) => {
            setFeatured(checked);
            startTransition(async () => {
              await toggleFeaturedPlayer(player.id, checked);
              toast.success(checked ? "Joueur mis en avant" : "Retiré de la sélection vedette");
            });
          }}
        />
        <span className="text-sm">Mettre en avant sur la page d&apos;accueil</span>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        Enregistrer les modifications
      </Button>
    </form>
  );
}
