import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PlayCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/cft-hero-stadium/1920/1080"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/85 to-background" />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-28 pb-24 text-center sm:px-6 sm:pt-36 sm:pb-32 lg:px-8">
        <span className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur">
          Cameroon Football Talents · Scouting professionnel
        </span>
        <h1 className="animate-fade-up font-display max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          La plateforme de référence des{" "}
          <span className="text-gradient-gold">talents du football camerounais</span>
        </h1>
        <p className="animate-fade-up mt-6 max-w-2xl text-base text-white/80 sm:text-lg" style={{ animationDelay: "0.1s" }}>
          Découvrez, comparez et recrutez les meilleurs joueurs camerounais. Statistiques
          détaillées, vidéos, fiches techniques et CV sportifs — tout ce dont les recruteurs,
          clubs et agents ont besoin, réuni en un seul endroit.
        </p>
        <div
          className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.2s" }}
        >
          <Button size="lg" variant="gold" asChild>
            <Link href="/joueurs">
              Découvrir les joueurs
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            asChild
          >
            <Link href="/actualites">
              <PlayCircleIcon />
              Voir les dernières actualités
            </Link>
          </Button>
        </div>
        <dl
          className="animate-fade-up mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 text-left sm:gap-14"
          style={{ animationDelay: "0.3s" }}
        >
          <div>
            <dt className="text-xs text-white/60 uppercase tracking-wide">Championnats</dt>
            <dd className="font-display mt-1 text-2xl font-bold">3</dd>
          </div>
          <div>
            <dt className="text-xs text-white/60 uppercase tracking-wide">Clubs partenaires</dt>
            <dd className="font-display mt-1 text-2xl font-bold">14+</dd>
          </div>
          <div>
            <dt className="text-xs text-white/60 uppercase tracking-wide">Pays d&apos;origine</dt>
            <dd className="font-display mt-1 text-2xl font-bold">Cameroun</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
