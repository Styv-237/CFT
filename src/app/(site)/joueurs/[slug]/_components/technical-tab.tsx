import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "@/components/shared/gauge";
import { TechnicalRadarChart } from "@/components/shared/technical-radar-chart";
import { TECHNICAL_ATTRIBUTE_LABELS } from "@/lib/labels";
import type { PlayerProfile } from "@/server/queries/players";

export function TechnicalTab({ player }: { player: PlayerProfile }) {
  const profile = player.technicalProfile;

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Fiche technique non disponible pour ce joueur.
        </CardContent>
      </Card>
    );
  }

  const attributes = Object.entries(TECHNICAL_ATTRIBUTE_LABELS).map(([key, label]) => ({
    key,
    attribute: label,
    value: profile[key as keyof typeof profile] as number,
  }));

  const overall = Math.round(attributes.reduce((sum, a) => sum + a.value, 0) / attributes.length);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vue d&apos;ensemble
            <span className="font-display text-2xl font-bold text-primary dark:text-accent">{overall}/100</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <TechnicalRadarChart data={attributes} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Détail des attributs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-6 sm:grid-cols-2">
          {attributes.map((a) => (
            <Gauge key={a.key} label={a.attribute} value={a.value} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
