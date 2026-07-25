import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#0a2e22] px-6 py-16 text-center text-primary-foreground sm:px-16">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="relative flex flex-col items-center gap-6">
          <h2 className="font-display max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Vous êtes joueur, club, agent ou recruteur ?
          </h2>
          <p className="max-w-xl text-sm text-white/80 sm:text-base">
            Rejoignez la plateforme de référence du scouting camerounais et donnez à vos talents
            la visibilité qu&apos;ils méritent.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="gold" asChild>
              <Link href="/inscription">
                Créer un compte
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              asChild
            >
              <Link href="/recherche">Recherche avancée</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
