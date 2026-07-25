import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";

import { Providers } from "@/components/layout/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "CFT — Cameroon Football Talents",
    template: "%s | CFT",
  },
  description:
    "La plateforme de référence des talents du football camerounais. Découvrez, comparez et recrutez les meilleurs joueurs du Cameroun.",
  keywords: [
    "football camerounais",
    "scouting",
    "Elite One",
    "Elite Two",
    "joueurs camerounais",
    "transfermarkt cameroun",
    "recrutement football",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "CFT — Cameroon Football Talents",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
