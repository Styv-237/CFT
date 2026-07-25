import type { Metadata } from "next";

import { auth } from "@/auth";

import { SettingsForms } from "./_components/settings-forms";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Gérez les informations de votre compte.</p>
      </div>
      <SettingsForms name={user.name ?? ""} email={user.email ?? ""} />
    </div>
  );
}
