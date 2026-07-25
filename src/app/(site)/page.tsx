import type { Metadata } from "next";

import { Hero } from "./_components/hero";
import { GlobalStats } from "./_components/global-stats";
import { FeaturedPlayers } from "./_components/featured-players";
import { TopPerformers } from "./_components/top-performers";
import { LatestPlayers } from "./_components/latest-players";
import { LatestVideos } from "./_components/latest-videos";
import { PartnerClubs } from "./_components/partner-clubs";
import { Testimonials } from "./_components/testimonials";
import { CtaSection } from "./_components/cta-section";

export const metadata: Metadata = {
  title: "CFT — La plateforme de référence des talents du football camerounais",
  description:
    "Découvrez, comparez et recrutez les meilleurs joueurs camerounais : statistiques, vidéos, fiches techniques et CV sportifs sur une seule plateforme.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <GlobalStats />
      <FeaturedPlayers />
      <TopPerformers />
      <LatestPlayers />
      <LatestVideos />
      <PartnerClubs />
      <Testimonials />
      <CtaSection />
    </>
  );
}
