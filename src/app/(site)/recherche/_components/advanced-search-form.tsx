"use client";

import { Loader2Icon, RotateCcwIcon, SearchIcon } from "lucide-react";

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
import { useFilterParams } from "@/hooks/use-filter-params";
import { FOOT_LABELS, POSITION_LABELS } from "@/lib/labels";

type FilterOptions = {
  clubs: { slug: string; name: string }[];
  leagues: { slug: string; name: string }[];
  nationalities: string[];
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function AdvancedSearchForm({ options }: { options: FilterOptions }) {
  const { values, setValue, reset, isPending } = useFilterParams(400);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Poste">
          <Select value={values.poste ?? "all"} onValueChange={(v) => setValue("poste", v === "all" ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les postes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les postes</SelectItem>
              {Object.entries(POSITION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Championnat">
          <Select
            value={values.championnat ?? "all"}
            onValueChange={(v) => setValue("championnat", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les championnats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les championnats</SelectItem>
              {options.leagues.map((l) => (
                <SelectItem key={l.slug} value={l.slug}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Âge maximum">
          <Input
            type="number"
            placeholder="Ex : 22"
            value={values.ageMax ?? ""}
            onChange={(e) => setValue("ageMax", e.target.value)}
          />
        </Field>

        <Field label="Pied fort">
          <Select value={values.pied ?? "all"} onValueChange={(v) => setValue("pied", v === "all" ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Indifférent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Indifférent</SelectItem>
              {Object.entries(FOOT_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Matchs joués (min., saison en cours)">
          <Input
            type="number"
            placeholder="Ex : 20"
            value={values.matchsMin ?? ""}
            onChange={(e) => setValue("matchsMin", e.target.value)}
          />
        </Field>

        <Field label="Précision des passes min. (%)">
          <Input
            type="number"
            placeholder="Ex : 80"
            value={values.passesMin ?? ""}
            onChange={(e) => setValue("passesMin", e.target.value)}
          />
        </Field>

        <Field label="Taille min. (cm)">
          <Input
            type="number"
            placeholder="Ex : 185"
            value={values.tailleMin ?? ""}
            onChange={(e) => setValue("tailleMin", e.target.value)}
          />
        </Field>

        <Field label="Nationalité">
          <Select
            value={values.nationalite ?? "all"}
            onValueChange={(v) => setValue("nationalite", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes nationalités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes nationalités</SelectItem>
              {options.nationalities.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
        {isPending ? (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <SearchIcon className="size-4 text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground">Les résultats se mettent à jour automatiquement.</span>
        <Button variant="ghost" size="sm" className="ml-auto gap-1.5" onClick={reset}>
          <RotateCcwIcon className="size-3.5" /> Réinitialiser
        </Button>
      </div>
    </div>
  );
}
