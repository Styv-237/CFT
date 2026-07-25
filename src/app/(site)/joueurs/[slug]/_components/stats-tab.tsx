import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlayerStatsChart } from "@/components/shared/player-stats-chart";
import type { PlayerProfile } from "@/server/queries/players";

const STAT_ROWS: { key: keyof PlayerProfile["statistics"][number]; label: string; suffix?: string }[] = [
  { key: "matches", label: "Matchs joués" },
  { key: "starts", label: "Titularisations" },
  { key: "minutesPlayed", label: "Minutes jouées" },
  { key: "goals", label: "Buts" },
  { key: "assists", label: "Passes décisives" },
  { key: "shots", label: "Tirs" },
  { key: "shotsOnTarget", label: "Tirs cadrés" },
  { key: "dribbles", label: "Dribbles réussis" },
  { key: "interceptions", label: "Interceptions" },
  { key: "duelsWon", label: "Duels gagnés" },
  { key: "successfulCrosses", label: "Centres réussis" },
  { key: "fouls", label: "Fautes" },
  { key: "yellowCards", label: "Cartons jaunes" },
  { key: "redCards", label: "Cartons rouges" },
  { key: "penalties", label: "Penaltys marqués" },
  { key: "passAccuracy", label: "Précision des passes", suffix: "%" },
];

export function StatsTab({ player }: { player: PlayerProfile }) {
  const stats = player.statistics;

  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Aucune statistique disponible pour le moment.
        </CardContent>
      </Card>
    );
  }

  const chartData = [...stats]
    .reverse()
    .map((s) => ({ season: s.season.label, buts: s.goals, passes: s.assists, matchs: s.matches }));

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Évolution buts &amp; passes décisives</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <PlayerStatsChart data={chartData} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Statistiques détaillées par saison</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Statistique</TableHead>
                {stats.map((s) => (
                  <TableHead key={s.id} className="text-right">
                    {s.season.label}
                    {s.club && <div className="font-normal normal-case">{s.club.shortName ?? s.club.name}</div>}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {STAT_ROWS.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="pl-6 font-medium text-muted-foreground">{row.label}</TableCell>
                  {stats.map((s) => (
                    <TableCell key={s.id} className="text-right font-medium">
                      {String(s[row.key])}
                      {row.suffix ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
