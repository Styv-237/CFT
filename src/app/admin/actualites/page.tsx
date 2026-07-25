import type { Metadata } from "next";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NEWS_CATEGORY_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

import { AdminPageHeader } from "../_components/admin-page-header";
import { DeleteNewsButton } from "./_components/delete-news-button";

export const metadata: Metadata = { title: "Administration — Actualités" };

export default async function AdminNewsPage() {
  const articles = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Actualités"
        description={`${articles.length} article(s)`}
        action={
          <Button asChild className="gap-2">
            <Link href="/admin/actualites/nouveau">
              <PlusIcon className="size-4" /> Nouvel article
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="pl-6 max-w-xs truncate font-medium">{article.title}</TableCell>
                <TableCell className="text-muted-foreground">{NEWS_CATEGORY_LABELS[article.category]}</TableCell>
                <TableCell>
                  <Badge variant={article.published ? "success" : "outline"}>
                    {article.published ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(article.publishedAt ?? article.createdAt)}</TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/actualites/${article.id}`}>
                        <PencilIcon className="size-4" />
                      </Link>
                    </Button>
                    <DeleteNewsButton newsId={article.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
