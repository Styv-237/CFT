import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CakeIcon,
  FlagIcon,
  MapPinIcon,
  ShieldAlertIcon,
  TrophyIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AVAILABILITY_LABELS, FOOT_LABELS, POSITION_LABELS } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PlayerProfile } from "@/server/queries/players";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function OverviewTab({ player }: { player: PlayerProfile }) {
  const activeInjury = player.injuries.find((i) => i.status === "ONGOING");
  const activeSuspension = player.suspensions.find((s) => new Date(s.endDate ?? s.startDate) >= new Date());

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-8 lg:col-span-2">
        {player.bio && (
          <Card>
            <CardHeader>
              <CardTitle>Biographie</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
              {player.bio}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Historique de carrière</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {player.careerHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun historique disponible.</p>
            ) : (
              <ol className="flex flex-col gap-0">
                {player.careerHistory.map((entry, i) => (
                  <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 flex size-2.5 shrink-0 rounded-full bg-primary" />
                      {i < player.careerHistory.length - 1 && (
                        <span className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{entry.clubName}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.startDate)} — {entry.endDate ? formatDate(entry.endDate) : "Présent"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entry.appearances ?? 0} matchs · {entry.goals ?? 0} buts
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {player.transfersFrom.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historique des transferts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-6">
              {player.transfersFrom.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{t.fromClub?.name ?? "Libre"}</span>
                    <span aria-hidden>→</span>
                    <span className="font-medium">{t.toClub?.name ?? "Libre"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(t.transferDate)}</span>
                    {t.transferFee && <Badge variant="secondary">{formatCurrency(t.transferFee)}</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {player.honors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrophyIcon className="size-4 text-accent" /> Palmarès
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 pb-6 sm:grid-cols-2">
              {player.honors.map((h) => (
                <div key={h.id} className="flex items-start gap-2.5 rounded-xl border border-border p-3">
                  <BadgeCheckIcon className="mt-0.5 size-4 shrink-0 text-primary dark:text-accent" />
                  <div>
                    <p className="text-sm font-medium">{h.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.competition} {h.seasonLabel ? `· ${h.seasonLabel}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <InfoRow
              label="Date de naissance"
              value={
                <span className="flex items-center gap-1.5">
                  <CakeIcon className="size-3.5 text-muted-foreground" /> {formatDate(player.birthDate)}
                </span>
              }
            />
            <InfoRow
              label="Ville natale"
              value={
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5 text-muted-foreground" /> {player.birthCity ?? "N/C"}
                </span>
              }
            />
            <InfoRow
              label="Nationalité"
              value={
                <span className="flex items-center gap-1.5">
                  <FlagIcon className="size-3.5 text-muted-foreground" /> {player.nationality}
                </span>
              }
            />
            <InfoRow label="Poste" value={POSITION_LABELS[player.position]} />
            <InfoRow label="Pied fort" value={FOOT_LABELS[player.preferredFoot]} />
            <InfoRow label="Club actuel" value={player.club?.name ?? "Sans club"} />
            {player.agent && (
              <InfoRow
                label="Agent"
                value={
                  <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="size-3.5 text-muted-foreground" /> {player.agent.name}
                  </span>
                }
              />
            )}
            <InfoRow label="Fin de contrat" value={player.contractEndDate ? formatDate(player.contractEndDate) : "N/C"} />
            <InfoRow label="Valeur estimée" value={formatCurrency(player.estimatedValue)} />
            <InfoRow label="Disponibilité" value={AVAILABILITY_LABELS[player.availability]} />
          </CardContent>
        </Card>

        {player.nationalTeamCalls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sélections nationales</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-6">
              {player.nationalTeamCalls.map((call) => (
                <div key={call.id} className="flex items-center gap-3">
                  {call.nationalTeam.logoUrl && (
                    <Image
                      src={call.nationalTeam.logoUrl}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full bg-secondary"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{call.nationalTeam.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {call.caps} sélection{call.caps > 1 ? "s" : ""} · {call.goals} but{call.goals > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {(activeInjury || activeSuspension) && (
          <Card className="border-warning/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <ShieldAlertIcon className="size-4" /> État physique
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-6">
              {activeInjury && (
                <div className="flex items-start gap-2.5 text-sm">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium">Blessure en cours</p>
                    <p className="text-xs text-muted-foreground">{activeInjury.description}</p>
                  </div>
                </div>
              )}
              {activeSuspension && (
                <div className="flex items-start gap-2.5 text-sm">
                  <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-warning" />
                  <div>
                    <p className="font-medium">Suspension</p>
                    <p className="text-xs text-muted-foreground">
                      {activeSuspension.reason} — jusqu&apos;au {formatDate(activeSuspension.endDate)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {player.club && (
          <Link
            href={`/clubs/${player.club.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-secondary"
          >
            {player.club.logoUrl && (
              <Image src={player.club.logoUrl} alt="" width={40} height={40} className="size-10 rounded-full" />
            )}
            <div>
              <p className="text-sm font-semibold">{player.club.name}</p>
              <p className="text-xs text-muted-foreground">Voir la fiche du club</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
