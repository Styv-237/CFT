"use client";

import { cn } from "@/lib/utils";

export function VideoPlayer({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string | null;
  className?: string;
}) {
  return (
    <video
      controls
      preload="none"
      poster={poster ?? undefined}
      className={cn("aspect-video w-full rounded-2xl bg-black", className)}
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne supporte pas la lecture de cette vidéo.
    </video>
  );
}
