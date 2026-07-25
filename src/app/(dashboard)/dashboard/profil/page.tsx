import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPlayerBySlug } from "@/server/queries/players";

import { PlayerProfileEditor } from "./_components/player-profile-editor";
import { ClubRosterManager } from "./_components/club-roster-manager";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const session = await auth();
  const user = session!.user;

  if (user.role === "PLAYER") {
    const playerRecord = user.playerId ? await prisma.player.findUnique({ where: { id: user.playerId } }) : null;
    const player = playerRecord ? await getPlayerBySlug(playerRecord.slug) : null;
    if (!player) {
      return <p className="text-sm text-muted-foreground">Profil joueur introuvable.</p>;
    }
    return <PlayerProfileEditor player={player} />;
  }

  if (user.role === "CLUB") {
    const club = user.clubId
      ? await prisma.club.findUnique({ where: { id: user.clubId }, include: { players: true } })
      : null;
    if (!club) {
      return (
        <p className="text-sm text-muted-foreground">
          Aucun club n&apos;est encore rattaché à votre compte. Contactez l&apos;administration.
        </p>
      );
    }
    return <ClubRosterManager club={club} />;
  }

  redirect("/dashboard");
}
