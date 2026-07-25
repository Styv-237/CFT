"use client";

import * as React from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PHOTO_CATEGORY_LABELS } from "@/lib/labels";
import type { PlayerProfile } from "@/server/queries/players";

export function PhotoGallery({ photos }: { photos: PlayerProfile["photos"] }) {
  const [active, setActive] = React.useState<PlayerProfile["photos"][number] | null>(null);

  if (photos.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Aucune photo disponible pour le moment.</p>;
  }

  const categories = Array.from(new Set(photos.map((p) => p.category)));

  return (
    <div className="flex flex-col gap-10">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold">{PHOTO_CATEGORY_LABELS[category]}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos
              .filter((p) => p.category === category)
              .map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setActive(photo)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? ""}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
          </div>
        </div>
      ))}

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{active?.caption ?? "Photo"}</DialogTitle>
          {active && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:aspect-video">
              <Image src={active.url} alt={active.caption ?? ""} fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
