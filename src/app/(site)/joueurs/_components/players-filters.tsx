"use client";

import { Loader2Icon, RotateCcwIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterParams } from "@/hooks/use-filter-params";
import { FOOT_LABELS, POSITION_LABELS, AVAILABILITY_LABELS } from "@/lib/labels";

type FilterOptions = {
  clubs: { slug: string; name: string }[];
  leagues: { slug: string; name: string }[];
  nationalities: string[];
};

function RangeField({
  label,
  unit,
  minKey,
  maxKey,
  values,
  setValue,
}: {
  label: string;
  unit: string;
  minKey: string;
  maxKey: string;
  values: Record<string, string>;
  setValue: (key: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">
        {label} ({unit})
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={values[minKey] ?? ""}
          onChange={(e) => setValue(minKey, e.target.value)}
          className="h-9"
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          placeholder="Max"
          value={values[maxKey] ?? ""}
          onChange={(e) => setValue(maxKey, e.target.value)}
          className="h-9"
        />
      </div>
    </div>
  );
}

export function PlayersFilters({ options }: { options: FilterOptions }) {
  const { values, setValue, reset, isPending } = useFilterParams();

  const activeAdvancedCount = [
    "ageMin",
    "ageMax",
    "tailleMin",
    "tailleMax",
    "poidsMin",
    "poidsMax",
    "pied",
    "nationalite",
    "valeurMax",
  ].filter((k) => values[k]).length;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <SearchIcon className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un joueur…"
          value={values.q ?? ""}
          onChange={(e) => setValue("q", e.target.value)}
          className="pl-10"
          aria-label="Rechercher un joueur par nom"
        />
      </div>

      <Select value={values.poste ?? "all"} onValueChange={(v) => setValue("poste", v === "all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Poste" />
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

      <Select
        value={values.championnat ?? "all"}
        onValueChange={(v) => setValue("championnat", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Championnat" />
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

      <Select value={values.club ?? "all"} onValueChange={(v) => setValue("club", v === "all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Club" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les clubs</SelectItem>
          {options.clubs.map((c) => (
            <SelectItem key={c.slug} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.disponibilite ?? "all"}
        onValueChange={(v) => setValue("disponibilite", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Disponibilité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes disponibilités</SelectItem>
          {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontalIcon className="size-4" />
            Plus de filtres
            {activeAdvancedCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
                {activeAdvancedCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="flex flex-col gap-4">
            <RangeField label="Âge" unit="ans" minKey="ageMin" maxKey="ageMax" values={values} setValue={setValue} />
            <RangeField label="Taille" unit="cm" minKey="tailleMin" maxKey="tailleMax" values={values} setValue={setValue} />
            <RangeField label="Poids" unit="kg" minKey="poidsMin" maxKey="poidsMax" values={values} setValue={setValue} />

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Pied fort</Label>
              <Select value={values.pied ?? "all"} onValueChange={(v) => setValue("pied", v === "all" ? "" : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pied fort" />
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
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Nationalité</Label>
              <Select
                value={values.nationalite ?? "all"}
                onValueChange={(v) => setValue("nationalite", v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nationalité" />
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
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Valeur estimée max. (€)</Label>
              <Input
                type="number"
                placeholder="Ex : 500000"
                value={values.valeurMax ?? ""}
                onChange={(e) => setValue("valeurMax", e.target.value)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" onClick={reset} aria-label="Réinitialiser les filtres">
        {isPending ? <Loader2Icon className="animate-spin" /> : <RotateCcwIcon />}
      </Button>
    </div>
  );
}
