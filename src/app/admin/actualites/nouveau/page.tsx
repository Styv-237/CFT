import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { createNewsAdmin } from "@/server/actions/admin/news";

import { AdminPageHeader } from "../../_components/admin-page-header";
import { NewsForm } from "../_components/news-form";

export const metadata: Metadata = { title: "Nouvel article" };

export default function NewArticlePage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Nouvel article" description="Publier une actualité" />
      <Card>
        <CardContent className="py-6">
          <NewsForm action={createNewsAdmin} />
        </CardContent>
      </Card>
    </div>
  );
}
