"use server";

import { autocompletePlayers } from "@/server/queries/players";

export async function searchPlayersAction(query: string) {
  const players = await autocompletePlayers(query);
  return players.map((p) => ({
    id: p.id,
    slug: p.slug,
    firstName: p.firstName,
    lastName: p.lastName,
    photoUrl: p.photoUrl,
    position: p.position,
    club: p.club ? { name: p.club.name, logoUrl: p.club.logoUrl } : null,
  }));
}
