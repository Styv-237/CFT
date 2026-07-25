import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { NEWS_CATEGORY_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import { getNewsList } from "@/server/queries/news";
import type { NewsCategory } from "@prisma/client";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Toute l'actualité du football camerounais : transferts, performances, sélections, blessures, académies et interviews.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const category = categorie && categorie in NEWS_CATEGORY_LABELS ? (categorie as NewsCategory) : undefined;
  const news = await getNewsList(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Blog" title="Actualités" description="Suivez l'actualité du football camerounais." />

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/actualites">
          <Badge variant={!category ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            Toutes
          </Badge>
        </Link>
        {Object.entries(NEWS_CATEGORY_LABELS).map(([value, label]) => (
          <Link key={value} href={`/actualites?categorie=${value}`}>
            <Badge variant={category === value ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      {news.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">Aucun article dans cette catégorie.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <Link key={article.id} href={`/actualites/${article.slug}`}>
              <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {article.coverImageUrl && (
                    <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
                  )}
                  <Badge className="absolute top-3 left-3">{NEWS_CATEGORY_LABELS[article.category]}</Badge>
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <p className="font-display line-clamp-2 font-semibold">{article.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <EyeIcon className="size-3.5" /> {article.views.toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
