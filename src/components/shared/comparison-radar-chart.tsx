"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export function ComparisonRadarChart({
  data,
  nameA,
  nameB,
}: {
  data: { attribute: string; a: number; b: number }[];
  nameA: string;
  nameB: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid className="stroke-border" />
        <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name={nameA} dataKey="a" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} strokeWidth={2} />
        <Radar name={nameB} dataKey="b" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.3} strokeWidth={2} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
