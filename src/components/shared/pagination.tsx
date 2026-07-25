"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Button variant="outline" size="icon" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} aria-label="Page précédente">
            <ChevronLeftIcon />
          </Link>
        ) : (
          <ChevronLeftIcon />
        )}
      </Button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted-foreground">…</span>}
          <Button variant={p === page ? "default" : "outline"} size="icon" asChild={p !== page}>
            {p === page ? <span>{p}</span> : <Link href={hrefFor(p)}>{p}</Link>}
          </Button>
        </span>
      ))}

      <Button variant="outline" size="icon" disabled={page >= pageCount} asChild={page < pageCount}>
        {page < pageCount ? (
          <Link href={hrefFor(page + 1)} aria-label="Page suivante">
            <ChevronRightIcon />
          </Link>
        ) : (
          <ChevronRightIcon />
        )}
      </Button>
    </nav>
  );
}
