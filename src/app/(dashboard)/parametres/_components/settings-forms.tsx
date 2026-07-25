"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, updateAccountName } from "@/server/actions/account";

export function SettingsForms({ name, email }: { name: string; email: string }) {
  const [isPending, startTransition] = React.useTransition();
  const passwordFormRef = React.useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await updateAccountName(formData);
                if (result.error) toast.error(result.error);
                else toast.success("Nom mis à jour");
              });
            }}
            className="flex flex-col gap-4 sm:max-w-sm"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" name="name" defaultValue={name} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
            <Button type="submit" disabled={isPending} className="w-fit">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            ref={passwordFormRef}
            action={(formData) => {
              startTransition(async () => {
                const result = await changePassword(formData);
                if (result.error) toast.error(result.error);
                else {
                  toast.success("Mot de passe mis à jour");
                  passwordFormRef.current?.reset();
                }
              });
            }}
            className="flex flex-col gap-4 sm:max-w-sm"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" name="newPassword" type="password" required />
            </div>
            <Button type="submit" disabled={isPending} className="w-fit">
              Changer le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
