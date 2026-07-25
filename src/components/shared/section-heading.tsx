import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.15em] text-accent uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  );
}
