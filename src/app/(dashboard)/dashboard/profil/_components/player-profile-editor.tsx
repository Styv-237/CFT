"use client";

import * as React from "react";
import { toast } from "sonner";
import { PlayIcon, TrashIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AVAILABILITY_LABELS, PHOTO_CATEGORY_LABELS, VIDEO_CATEGORY_LABELS } from "@/lib/labels";
import {
  addPlayerPhoto,
  addPlayerVideo,
  deletePlayerPhoto,
  deletePlayerVideo,
  updatePlayerProfile,
} from "@/server/actions/player-profile";
import type { PlayerProfile } from "@/server/queries/players";

export function PlayerProfileEditor({ player }: { player: PlayerProfile }) {
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await updatePlayerProfile(formData);
                if (result.error) toast.error(result.error);
                else toast.success("Profil mis à jour");
              });
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" name="bio" defaultValue={player.bio ?? ""} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="photoUrl">URL de la photo</Label>
                <Input id="photoUrl" name="photoUrl" defaultValue={player.photoUrl ?? ""} placeholder="https://…" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="coverUrl">URL de la photo de couverture</Label>
                <Input id="coverUrl" name="coverUrl" defaultValue={player.coverUrl ?? ""} placeholder="https://…" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label>Disponibilité</Label>
                <Select name="availability" defaultValue={player.availability}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
                <Input
                  id="estimatedValue"
                  name="estimatedValue"
                  type="number"
                  defaultValue={player.estimatedValue ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contractEndDate">Fin de contrat</Label>
                <Input
                  id="contractEndDate"
                  name="contractEndDate"
                  type="date"
                  defaultValue={player.contractEndDate ? player.contractEndDate.toISOString().slice(0, 10) : ""}
                />
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
          <CardTitle>Vidéos ({player.videos.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-6">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await addPlayerVideo(formData);
                if (result.error) toast.error(result.error);
                else toast.success("Vidéo ajoutée");
              });
            }}
            className="grid gap-3 rounded-xl bg-secondary/40 p-4 sm:grid-cols-4"
          >
            <Input name="title" placeholder="Titre de la vidéo" required className="sm:col-span-2" />
            <Input name="url" placeholder="URL (.mp4)" required />
            <Select name="category" defaultValue="HIGHLIGHTS">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VIDEO_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isPending} className="sm:col-span-4 w-fit">
              Ajouter la vidéo
            </Button>
          </form>
          <div className="flex flex-col gap-2">
            {player.videos.map((video) => (
              <div key={video.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span className="flex items-center gap-2">
                  <PlayIcon className="size-3.5 text-muted-foreground" />
                  {video.title}
                  <Badge variant="secondary">{VIDEO_CATEGORY_LABELS[video.category]}</Badge>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    startTransition(async () => {
                      await deletePlayerVideo(video.id);
                      toast.success("Vidéo supprimée");
                    })
                  }
                >
                  <TrashIcon className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos ({player.photos.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-6">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await addPlayerPhoto(formData);
                if (result.error) toast.error(result.error);
                else toast.success("Photo ajoutée");
              });
            }}
            className="grid gap-3 rounded-xl bg-secondary/40 p-4 sm:grid-cols-4"
          >
            <Input name="url" placeholder="URL de la photo" required className="sm:col-span-2" />
            <Select name="category" defaultValue="ACTION">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PHOTO_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input name="caption" placeholder="Légende (optionnel)" />
            <Button type="submit" disabled={isPending} className="sm:col-span-4 w-fit">
              Ajouter la photo
            </Button>
          </form>
          <div className="flex flex-col gap-2">
            {player.photos.map((photo) => (
              <div key={photo.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span className="flex items-center gap-2">
                  {photo.caption ?? photo.url}
                  <Badge variant="secondary">{PHOTO_CATEGORY_LABELS[photo.category]}</Badge>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    startTransition(async () => {
                      await deletePlayerPhoto(photo.id);
                      toast.success("Photo supprimée");
                    })
                  }
                >
                  <TrashIcon className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
