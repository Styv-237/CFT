import type {
  AvailabilityStatus,
  PlayerPosition,
  PreferredFoot,
} from "@prisma/client";

export type PlayerSearchFilters = {
  q?: string;
  clubSlug?: string;
  leagueSlug?: string;
  position?: PlayerPosition;
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  foot?: PreferredFoot;
  nationality?: string;
  availability?: AvailabilityStatus;
  valueMax?: number;
  minMatches?: number;
  minPassAccuracy?: number;
  page?: number;
};

const num = (v: string | string[] | undefined) => {
  if (typeof v !== "string" || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const str = (v: string | string[] | undefined) => (typeof v === "string" && v !== "" ? v : undefined);

export function parsePlayerSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): PlayerSearchFilters {
  return {
    q: str(searchParams.q),
    clubSlug: str(searchParams.club),
    leagueSlug: str(searchParams.championnat),
    position: str(searchParams.poste) as PlayerPosition | undefined,
    ageMin: num(searchParams.ageMin),
    ageMax: num(searchParams.ageMax),
    heightMin: num(searchParams.tailleMin),
    heightMax: num(searchParams.tailleMax),
    weightMin: num(searchParams.poidsMin),
    weightMax: num(searchParams.poidsMax),
    foot: str(searchParams.pied) as PreferredFoot | undefined,
    nationality: str(searchParams.nationalite),
    availability: str(searchParams.disponibilite) as AvailabilityStatus | undefined,
    valueMax: num(searchParams.valeurMax),
    minMatches: num(searchParams.matchsMin),
    minPassAccuracy: num(searchParams.passesMin),
    page: num(searchParams.page) ?? 1,
  };
}
