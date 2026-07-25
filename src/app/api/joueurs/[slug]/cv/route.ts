import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { getPlayerBySlug } from "@/server/queries/players";
import { PlayerCvDocument } from "@/lib/pdf/player-cv-document";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) {
    return NextResponse.json({ error: "Joueur introuvable" }, { status: 404 });
  }

  const buffer = await renderToBuffer(PlayerCvDocument({ player }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="CV-${player.firstName}-${player.lastName}.pdf"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
