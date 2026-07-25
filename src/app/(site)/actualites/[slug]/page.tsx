import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, EyeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { NEWS_CATEGORY_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import { getNewsBySlug } from "@/server/queries/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: article.coverImageUrl ? [article.coverImageUrl] : undefined },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/actualites" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" /> Retour aux actualités
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <Badge>{NEWS_CATEGORY_LABELS[article.category]}</Badge>
        <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <EyeIcon className="size-3.5" /> {article.views.toLocaleString("fr-FR")} vues
        </span>
      </div>

      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>
      <p className="mt-3 text-base text-muted-foreground">{article.excerpt}</p>

      {article.coverImageUrl && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-muted">
          <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <div className="mt-8 max-w-none space-y-4 text-[15px] leading-relaxed whitespace-pre-line text-foreground/90">
        {article.content}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        Rédigé par <span className="font-medium text-foreground">{article.author.name}</span>
      </div>
    </article>
  );
}
