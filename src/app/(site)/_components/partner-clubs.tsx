import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { getPartnerClubs } from "@/server/queries/clubs";

export async function PartnerClubs() {
  const clubs = await getPartnerClubs(14);
  if (clubs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading align="center" eyebrow="Ils nous font confiance" title="Clubs partenaires" />
      <div className="mt-10 grid grid-cols-3 gap-6 sm:grid-cols-5 lg:grid-cols-7">
        {clubs.map((club) => (
          <Link
            key={club.id}
            href={`/clubs/${club.slug}`}
            className="group flex flex-col items-center gap-2 grayscale transition-all hover:grayscale-0"
            title={club.name}
          >
            {club.logoUrl && (
              <Image
                src={club.logoUrl}
                alt={club.name}
                width={56}
                height={56}
                className="size-12 rounded-full bg-secondary p-1.5 opacity-70 transition-opacity group-hover:opacity-100 sm:size-14"
              />
            )}
            <span className="truncate text-center text-[0.65rem] text-muted-foreground">
              {club.shortName ?? club.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
