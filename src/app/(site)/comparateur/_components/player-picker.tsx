"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, UserIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { POSITION_LABELS } from "@/lib/labels";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { searchPlayersAction } from "@/server/actions/search";

type Result = Awaited<ReturnType<typeof searchPlayersAction>>[number];

export function PlayerPicker({
  slotKey,
  label,
  currentSlug,
  currentLabel,
}: {
  slotKey: "a" | "b";
  label: string;
  currentSlug?: string;
  currentLabel?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<Result[]>([]);
  const debouncedQuery = useDebouncedValue(query, 300);

  React.useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    let active = true;
    searchPlayersAction(debouncedQuery).then((data) => {
      if (active) setResults(data);
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const select = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(slotKey, slug);
    router.push(`/comparateur?${params.toString()}`);
    setOpen(false);
    setQuery("");
  };

  const clear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(slotKey);
    router.push(`/comparateur?${params.toString()}`);
  };

  if (currentSlug) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium">
          <UserIcon className="size-4 text-muted-foreground" />
          {currentLabel}
        </div>
        <Button variant="ghost" size="icon" onClick={clear} aria-label={`Retirer ${label}`}>
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-border bg-card p-4 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-foreground">
          <SearchIcon className="size-4" />
          Sélectionner {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        <Input
          autoFocus
          placeholder="Rechercher un joueur…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2"
        />
        <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
          {results.length === 0 && query.trim().length >= 2 && (
            <p className="p-2 text-xs text-muted-foreground">Aucun résultat.</p>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => select(r.slug)}
              className="flex items-center gap-2.5 rounded-lg p-2 text-left text-sm hover:bg-secondary"
            >
              <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted">
                {r.photoUrl && <Image src={r.photoUrl} alt="" fill className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {r.firstName} {r.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {POSITION_LABELS[r.position]} {r.club ? `· ${r.club.name}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
