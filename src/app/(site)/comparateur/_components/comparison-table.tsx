import { cn } from "@/lib/utils";

type Row = {
  label: string;
  a: string | number;
  b: string | number;
  higherIsBetter?: boolean;
};

function Cell({ value, isWinner }: { value: string | number; isWinner: boolean }) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-center text-sm",
        isWinner ? "font-bold text-primary dark:text-accent" : "text-foreground"
      )}
    >
      {value}
    </td>
  );
}

export function ComparisonTable({ rows, nameA, nameB }: { rows: Row[]; nameA: string; nameB: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-secondary/60 text-xs tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3 text-left">Critère</th>
            <th className="px-4 py-3 text-center">{nameA}</th>
            <th className="px-4 py-3 text-center">{nameB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const aNum = typeof row.a === "number" ? row.a : parseFloat(String(row.a));
            const bNum = typeof row.b === "number" ? row.b : parseFloat(String(row.b));
            const comparable = row.higherIsBetter !== undefined && !Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum;
            const aWins = comparable && (row.higherIsBetter ? aNum > bNum : aNum < bNum);
            const bWins = comparable && (row.higherIsBetter ? bNum > aNum : bNum < aNum);

            return (
              <tr key={row.label} className="border-t border-border">
                <td className="px-4 py-3 text-sm text-muted-foreground">{row.label}</td>
                <Cell value={row.a} isWinner={aWins} />
                <Cell value={row.b} isWinner={bWins} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
