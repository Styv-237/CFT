import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M12 2.5 4.5 6v6c0 5.1 3.2 8.6 7.5 9.5 4.3-.9 7.5-4.4 7.5-9.5V6L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M9 12.2l2.1 2.1L15.5 10"
            stroke="var(--accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display flex flex-col leading-none">
        <span className="text-[1.05rem] font-bold tracking-tight">
          CFT
        </span>
        <span className="text-[0.6rem] font-medium tracking-wide text-muted-foreground uppercase">
          Cameroon Football Talents
        </span>
      </span>
    </Link>
  );
}
