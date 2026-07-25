import { cn } from "@/lib/utils";

function tierColor(value: number) {
  if (value >= 85) return "bg-success";
  if (value >= 70) return "bg-primary";
  if (value >= 50) return "bg-warning";
  return "bg-destructive";
}

export function Gauge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-display font-bold tabular-nums">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", tierColor(value))}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
