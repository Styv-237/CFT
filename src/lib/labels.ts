export const POSITION_LABELS: Record<string, string> = {
  GOALKEEPER: "Gardien de but",
  CENTER_BACK: "Défenseur central",
  LEFT_BACK: "Arrière gauche",
  RIGHT_BACK: "Arrière droit",
  DEFENSIVE_MIDFIELD: "Milieu défensif",
  CENTER_MIDFIELD: "Milieu central",
  ATTACKING_MIDFIELD: "Milieu offensif",
  LEFT_WINGER: "Ailier gauche",
  RIGHT_WINGER: "Ailier droit",
  STRIKER: "Attaquant",
};

export const POSITION_SHORT_LABELS: Record<string, string> = {
  GOALKEEPER: "GB",
  CENTER_BACK: "DC",
  LEFT_BACK: "AG",
  RIGHT_BACK: "AD",
  DEFENSIVE_MIDFIELD: "MDF",
  CENTER_MIDFIELD: "MC",
  ATTACKING_MIDFIELD: "MOC",
  LEFT_WINGER: "AIG",
  RIGHT_WINGER: "AID",
  STRIKER: "BU",
};

export const FOOT_LABELS: Record<string, string> = {
  LEFT: "Gauche",
  RIGHT: "Droit",
  BOTH: "Ambidextre",
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  TRANSFER_AVAILABLE: "Transférable",
  LOAN_AVAILABLE: "Prêt possible",
  FREE_AGENT: "Libre",
  NOT_AVAILABLE: "Non disponible",
};

export const AVAILABILITY_BADGE_VARIANT: Record<string, "success" | "warning" | "secondary" | "outline"> = {
  TRANSFER_AVAILABLE: "success",
  LOAN_AVAILABLE: "warning",
  FREE_AGENT: "success",
  NOT_AVAILABLE: "outline",
};

export const VIDEO_CATEGORY_LABELS: Record<string, string> = {
  HIGHLIGHTS: "Highlights",
  FULL_MATCH: "Match complet",
  COMPILATION: "Compilation",
  TRAINING: "Entraînement",
  INTERVIEW: "Interview",
};

export const PHOTO_CATEGORY_LABELS: Record<string, string> = {
  PORTRAIT: "Portrait",
  ACTION: "Action",
  MATCH: "Match",
  TRAINING: "Entraînement",
  NATIONAL_TEAM: "Sélection nationale",
};

export const NEWS_CATEGORY_LABELS: Record<string, string> = {
  TRANSFERTS: "Transferts",
  PERFORMANCES: "Performances",
  SELECTIONS: "Sélections",
  BLESSURES: "Blessures",
  ACADEMIES: "Académies",
  INTERVIEWS: "Interviews",
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  PLAYER: "Joueur",
  CLUB: "Club",
  RECRUITER: "Recruteur",
  AGENT: "Agent",
  ACADEMY: "Académie",
};

export const TECHNICAL_ATTRIBUTE_LABELS: Record<string, string> = {
  speed: "Vitesse",
  technique: "Technique",
  vision: "Vision",
  power: "Puissance",
  aerialDuel: "Jeu aérien",
  acceleration: "Accélération",
  stamina: "Endurance",
  leadership: "Leadership",
  discipline: "Discipline",
  positioning: "Placement",
  control: "Contrôle",
  finishing: "Finition",
};
