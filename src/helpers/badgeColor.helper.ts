/** Nom d'une couleur de la palette des badges. */
export type BadgeColorName = "gray" | "blue" | "green" | "emerald" | "red" | "orange" | "amber" | "yellow" | "violet" | "purple" | "pink" | "indigo" | "cyan";

/** Couleur d'un badge : classes du badge (variant `outline`), de sa pastille, et teinte hexadécimale. */
export type BadgeColor = {
  badgeClassName: string;
  dotClassName: string;
  hex: string;
};

/** Palette des badges de statut : fond clair, texte foncé et bordure de la même teinte. */
export const BADGE_COLORS = {
  gray: {
    badgeClassName: "bg-gray-100 text-gray-900 border-gray-400 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-700",
    dotClassName: "bg-gray-500",
    hex: "#6b7280",
  },
  blue: {
    badgeClassName: "bg-blue-100 text-blue-900 border-blue-400 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-700",
    dotClassName: "bg-blue-600",
    hex: "#2563eb",
  },
  green: {
    badgeClassName: "bg-green-100 text-green-900 border-green-400 dark:bg-green-950 dark:text-green-400 dark:border-green-700",
    dotClassName: "bg-green-600",
    hex: "#16a34a",
  },
  emerald: {
    badgeClassName: "bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-700",
    dotClassName: "bg-emerald-600",
    hex: "#059669",
  },
  red: {
    badgeClassName: "bg-red-100 text-red-900 border-red-400 dark:bg-red-950 dark:text-red-400 dark:border-red-700",
    dotClassName: "bg-red-600",
    hex: "#dc2626",
  },
  orange: {
    badgeClassName: "bg-orange-100 text-orange-900 border-orange-400 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-700",
    dotClassName: "bg-orange-600",
    hex: "#ea580c",
  },
  amber: {
    badgeClassName: "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-700",
    dotClassName: "bg-amber-500",
    hex: "#f59e0b",
  },
  yellow: {
    badgeClassName: "bg-yellow-100 text-yellow-900 border-yellow-400 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-700",
    dotClassName: "bg-yellow-600",
    hex: "#ca8a04",
  },
  violet: {
    badgeClassName: "bg-violet-100 text-violet-900 border-violet-400 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-700",
    dotClassName: "bg-violet-600",
    hex: "#7c3aed",
  },
  purple: {
    badgeClassName: "bg-purple-100 text-purple-900 border-purple-400 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-700",
    dotClassName: "bg-purple-600",
    hex: "#9333ea",
  },
  pink: {
    badgeClassName: "bg-pink-100 text-pink-900 border-pink-400 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-700",
    dotClassName: "bg-pink-600",
    hex: "#db2777",
  },
  indigo: {
    badgeClassName: "bg-indigo-100 text-indigo-900 border-indigo-400 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-700",
    dotClassName: "bg-indigo-600",
    hex: "#4f46e5",
  },
  cyan: {
    badgeClassName: "bg-cyan-100 text-cyan-900 border-cyan-400 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-700",
    dotClassName: "bg-cyan-600",
    hex: "#0891b2",
  },
} as const satisfies Record<BadgeColorName, BadgeColor>;

const isBadgeColorName = (name: string): name is BadgeColorName => Object.keys(BADGE_COLORS).includes(name);

/** Résout une couleur de la palette par son nom, gray si le nom est inconnu ou vide. */
export const getBadgeColor = (name?: string | null): BadgeColor =>
  name !== undefined && name !== null && isBadgeColorName(name) ? BADGE_COLORS[name] : BADGE_COLORS.gray;
