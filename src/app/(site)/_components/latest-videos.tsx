import Image from "next/image";
import Link from "next/link";
import { PlayIcon } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { VIDEO_CATEGORY_LABELS } from "@/lib/labels";
import { getLatestVideos } from "@/server/queries/players";

export async function LatestVideos() {
  const videos = await getLatestVideos(6);
  if (videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Vidéothèque"
        title="Dernières vidéos"
        description="Highlights, matchs complets et interviews récemment ajoutés par les joueurs et clubs."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/joueurs/${video.player.slug}?onglet=videos`}
            className="group flex flex-col gap-3"
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex size-12 items-center justify-center rounded-full bg-white/90">
                  <PlayIcon className="ml-0.5 size-5 fill-primary text-primary" />
                </span>
              </div>
              <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                {VIDEO_CATEGORY_LABELS[video.category]}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted">
                {video.player.photoUrl && (
                  <Image src={video.player.photoUrl} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{video.title}</p>
                <p className="text-xs text-muted-foreground">
                  {video.player.firstName} {video.player.lastName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
