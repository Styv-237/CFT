"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateLeagueAdmin } from "@/server/actions/admin/leagues";
import type { League } from "@prisma/client";

export function LeagueEditCard({ league }: { league: League }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{league.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await updateLeagueAdmin(league.id, formData);
              if (result.error) toast.error(result.error);
              else {
                toast.success("Championnat mis à jour");
                router.refresh();
              }
            });
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`name-${league.id}`}>Nom</Label>
            <Input id={`name-${league.id}`} name="name" defaultValue={league.name} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`logo-${league.id}`}>URL du logo</Label>
            <Input id={`logo-${league.id}`} name="logoUrl" defaultValue={league.logoUrl ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`desc-${league.id}`}>Description</Label>
            <Textarea id={`desc-${league.id}`} name="description" defaultValue={league.description ?? ""} rows={3} />
          </div>
          <Button type="submit" disabled={isPending} className="w-fit">
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
