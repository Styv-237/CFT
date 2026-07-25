import { StarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";

const TESTIMONIALS = [
  {
    quote:
      "CFT nous a permis d'identifier deux jeunes défenseurs prometteurs sans avoir à nous déplacer. Les fiches techniques et les vidéos font gagner un temps précieux.",
    name: "Recruteur",
    role: "Club professionnel — Europe",
  },
  {
    quote:
      "Une vitrine indispensable pour nos joueurs. Nous avons pu générer des opportunités concrètes grâce aux CV sportifs et à la visibilité offerte par la plateforme.",
    name: "Direction sportive",
    role: "Académie de formation",
  },
  {
    quote:
      "L'outil de comparaison et la recherche avancée sont exactement ce qu'il manquait pour évaluer objectivement les talents camerounais.",
    name: "Agent de joueurs",
    role: "Agence internationale",
  },
];

export function Testimonials() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Témoignages"
          title="Ce qu'ils disent de CFT"
          className="[&_h2]:text-primary-foreground"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-white/10 bg-white/5 text-primary-foreground">
              <CardContent className="flex flex-col gap-4 pt-6 pb-2">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-white/85">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-2 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-white/60">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
