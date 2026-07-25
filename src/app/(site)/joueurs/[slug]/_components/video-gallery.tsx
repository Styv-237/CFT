"use client";

import * as React from "react";
import Image from "next/image";
import { PlayIcon } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/shared/video-player";
import { VIDEO_CATEGORY_LABELS } from "@/lib/labels";
import type { PlayerProfile } from "@/server/queries/players";

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoGallery({ videos }: { videos: PlayerProfile["videos"] }) {
  const [active, setActive] = React.useState<PlayerProfile["videos"][number] | null>(null);

  if (videos.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Aucune vidéo disponible pour le moment.</p>;
  }

  const categories = Array.from(new Set(videos.map((v) => v.category)));

  return (
    <div className="flex flex-col gap-10">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold">{VIDEO_CATEGORY_LABELS[category]}</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos
              .filter((v) => v.category === category)
              .map((video) => (
                <button
                  key={video.id}
                  onClick={() => setActive(video)}
                  className="group flex flex-col gap-2.5 text-left"
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
                    {video.thumbnailUrl && (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        sizes="(min-width: 1024px) 30vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                      <span className="flex size-12 items-center justify-center rounded-full bg-white/90">
                        <PlayIcon className="ml-0.5 size-5 fill-primary text-primary" />
                      </span>
                    </div>
                    {video.durationSec && (
                      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[0.65rem] text-white">
                        {formatDuration(video.durationSec)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.views.toLocaleString("fr-FR")} vues</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {active?.title}
              {active && <Badge variant="secondary">{VIDEO_CATEGORY_LABELS[active.category]}</Badge>}
            </DialogTitle>
          </DialogHeader>
          {active && <VideoPlayer src={active.url} poster={active.thumbnailUrl} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
