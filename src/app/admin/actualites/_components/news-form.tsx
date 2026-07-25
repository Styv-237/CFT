"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NEWS_CATEGORY_LABELS } from "@/lib/labels";
import type { News } from "@prisma/client";

export function NewsForm({
  article,
  action,
}: {
  article?: News;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [published, setPublished] = React.useState(article?.published ?? false);

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await action(formData);
          if (result?.error) toast.error(result.error);
          else {
            toast.success(article ? "Article mis à jour" : "Article créé");
            router.refresh();
          }
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" defaultValue={article?.title} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Extrait</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={article?.excerpt} rows={2} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenu</Label>
        <Textarea id="content" name="content" defaultValue={article?.content} rows={8} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Catégorie</Label>
          <Select name="category" defaultValue={article?.category ?? "PERFORMANCES"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NEWS_CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coverImageUrl">URL de couverture</Label>
          <Input id="coverImageUrl" name="coverImageUrl" defaultValue={article?.coverImageUrl ?? ""} />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
        <Switch checked={published} onCheckedChange={setPublished} />
        <input type="hidden" name="published" value={published ? "on" : ""} />
        <span className="text-sm">Publier l&apos;article</span>
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {article ? "Enregistrer" : "Créer l'article"}
      </Button>
    </form>
  );
}
