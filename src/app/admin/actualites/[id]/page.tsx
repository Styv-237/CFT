import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateNewsAdmin } from "@/server/actions/admin/news";

import { AdminPageHeader } from "../../_components/admin-page-header";
import { NewsForm } from "../_components/news-form";

export const metadata: Metadata = { title: "Modifier un article" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.news.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={article.title} description="Modifier l'article" />
      <Card>
        <CardContent className="py-6">
          <NewsForm article={article} action={updateNewsAdmin.bind(null, article.id)} />
        </CardContent>
      </Card>
    </div>
  );
}
