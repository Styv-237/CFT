import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { AVAILABILITY_LABELS, FOOT_LABELS, POSITION_LABELS, TECHNICAL_ATTRIBUTE_LABELS } from "@/lib/labels";
import { calculateAge, formatCurrency, formatDate } from "@/lib/utils";
import type { PlayerProfile } from "@/server/queries/players";

const COLORS = {
  primary: "#0b3d2e",
  gold: "#c9a227",
  text: "#1a1f1d",
  muted: "#5b6560",
  border: "#e1e5e2",
  bg: "#f6f7f6",
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: COLORS.text, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  photo: { width: 76, height: 76, borderRadius: 8, backgroundColor: "#ffffff33" },
  headerText: { color: "#ffffff", flex: 1 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#e8f0ec", marginBottom: 2 },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  badge: {
    backgroundColor: COLORS.gold,
    color: "#1a1a1a",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 4,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  infoItem: { width: "33.33%", marginBottom: 8 },
  infoLabel: { fontSize: 8, color: COLORS.muted, textTransform: "uppercase" },
  infoValue: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 2 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  strengthPill: {
    backgroundColor: COLORS.bg,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.muted,
  },
});

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function PlayerCvDocument({ player }: { player: PlayerProfile }) {
  const age = calculateAge(player.birthDate);
  const latestStats = player.statistics[0];
  const technical = player.technicalProfile;

  const topStrengths = technical
    ? Object.entries(TECHNICAL_ATTRIBUTE_LABELS)
        .map(([key, label]) => ({ label, value: technical[key as keyof typeof technical] as number }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4)
    : [];

  return (
    <Document
      title={`CV Sportif — ${player.firstName} ${player.lastName}`}
      author="Cameroon Football Talents"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is a PDF primitive, not an <img> */}
          {player.photoUrl && <Image src={player.photoUrl} style={styles.photo} />}
          <View style={styles.headerText}>
            <Text style={styles.name}>
              {player.firstName} {player.lastName}
            </Text>
            <Text style={styles.subtitle}>
              {POSITION_LABELS[player.position]} · {age} ans · {player.nationality}
            </Text>
            {player.club && <Text style={styles.subtitle}>{player.club.name}</Text>}
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{AVAILABILITY_LABELS[player.availability]}</Text>
              <Text style={styles.badge}>{formatCurrency(player.estimatedValue)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          <View style={styles.grid}>
            <Info label="Date de naissance" value={formatDate(player.birthDate)} />
            <Info label="Ville natale" value={player.birthCity ?? "N/C"} />
            <Info label="Taille / Poids" value={`${player.heightCm ?? "N/C"} cm / ${player.weightKg ?? "N/C"} kg`} />
            <Info label="Pied fort" value={FOOT_LABELS[player.preferredFoot]} />
            <Info label="Numéro" value={player.shirtNumber ? `N°${player.shirtNumber}` : "N/C"} />
            <Info label="Fin de contrat" value={player.contractEndDate ? formatDate(player.contractEndDate) : "N/C"} />
            <Info label="Agent" value={player.agent?.name ?? "N/C"} />
            <Info label="Académie" value={player.academy?.name ?? "N/C"} />
          </View>
        </View>

        {topStrengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Points forts</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {topStrengths.map((s) => (
                <Text key={s.label} style={styles.strengthPill}>
                  {s.label} — {s.value}/100
                </Text>
              ))}
            </View>
          </View>
        )}

        {latestStats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistiques ({latestStats.season.label})</Text>
            <View style={styles.grid}>
              <Info label="Matchs" value={String(latestStats.matches)} />
              <Info label="Titularisations" value={String(latestStats.starts)} />
              <Info label="Buts" value={String(latestStats.goals)} />
              <Info label="Passes décisives" value={String(latestStats.assists)} />
              <Info label="Minutes jouées" value={String(latestStats.minutesPlayed)} />
              <Info label="Précision des passes" value={`${latestStats.passAccuracy}%`} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique de carrière</Text>
          {player.careerHistory.length === 0 ? (
            <Text>Aucun historique disponible.</Text>
          ) : (
            player.careerHistory.map((entry) => (
              <View key={entry.id} style={styles.row}>
                <Text>{entry.clubName}</Text>
                <Text>
                  {formatDate(entry.startDate)} — {entry.endDate ? formatDate(entry.endDate) : "Présent"}
                </Text>
                <Text>
                  {entry.appearances ?? 0} matchs / {entry.goals ?? 0} buts
                </Text>
              </View>
            ))
          )}
        </View>

        {player.honors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Palmarès</Text>
            {player.honors.map((h) => (
              <View key={h.id} style={styles.row}>
                <Text>{h.title}</Text>
                <Text>
                  {h.competition} {h.seasonLabel ? `— ${h.seasonLabel}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {player.nationalTeamCalls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sélections nationales</Text>
            {player.nationalTeamCalls.map((call) => (
              <View key={call.id} style={styles.row}>
                <Text>{call.nationalTeam.name}</Text>
                <Text>
                  {call.caps} sélections — {call.goals} buts
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>Cameroon Football Talents — cft.cm</Text>
          <Text>Document généré le {formatDate(new Date())}</Text>
        </View>
      </Page>
    </Document>
  );
}
