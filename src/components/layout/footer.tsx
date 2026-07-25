import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import {
  FacebookGlyph,
  InstagramGlyph,
  XGlyph,
  YoutubeGlyph,
} from "@/components/layout/social-glyphs";

const FOOTER_LINKS = [
  {
    title: "Plateforme",
    links: [
      { href: "/joueurs", label: "Répertoire des joueurs" },
      { href: "/clubs", label: "Clubs" },
      { href: "/championnats", label: "Championnats" },
      { href: "/comparateur", label: "Comparateur" },
      { href: "/recherche", label: "Recherche avancée" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/actualites", label: "Actualités" },
      { href: "/actualites?categorie=TRANSFERTS", label: "Transferts" },
      { href: "/actualites?categorie=SELECTIONS", label: "Sélections" },
      { href: "/actualites?categorie=ACADEMIES", label: "Académies" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/inscription?role=PLAYER", label: "Je suis joueur" },
      { href: "/inscription?role=CLUB", label: "Je suis un club" },
      { href: "/inscription?role=RECRUITER", label: "Je suis recruteur" },
      { href: "/connexion", label: "Connexion" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              La plateforme de référence des talents du football camerounais.
              Vitrine professionnelle pour recruteurs, clubs, agents et académies du monde entier.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Link href="#" aria-label="Facebook" className="hover:text-primary">
                <FacebookGlyph className="size-4" />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-primary">
                <InstagramGlyph className="size-4" />
              </Link>
              <Link href="#" aria-label="X (Twitter)" className="hover:text-primary">
                <XGlyph className="size-4" />
              </Link>
              <Link href="#" aria-label="YouTube" className="hover:text-primary">
                <YoutubeGlyph className="size-4" />
              </Link>
            </div>
          </div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-display text-sm font-semibold">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CFT — Cameroon Football Talents. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-foreground">Mentions légales</Link>
            <Link href="#" className="hover:text-foreground">Confidentialité</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
