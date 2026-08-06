import { radiusPresets } from "@/tokens";
import type { TokenFamily } from "@/tokens";

export interface DemoTokenFamily {
  /** Clé du global Storybook, aussi utilisée comme id du sélecteur de toolbar. */
  id: string;
  /** Titre affiché dans la barre d'outils. */
  title: string;
  /** Icône Storybook (voir https://storybook.js.org/docs/faq#what-icons-are-available). */
  icon: string;
  presets: TokenFamily;
  defaultPreset: string;
  /** Libellés de toolbar par preset — le nom du preset sert de repli. */
  labels?: Record<string, string>;
}

/**
 * Familles de tokens exposées dans la barre d'outils Storybook.
 *
 * Source de vérité unique : ajouter une entrée ici suffit à obtenir le sélecteur
 * et l'application runtime, sans toucher au décorateur ni écrire de CSS.
 */
export const DEMO_TOKEN_FAMILIES: DemoTokenFamily[] = [
  {
    id: "radius",
    title: "Radius",
    icon: "component",
    presets: radiusPresets,
    defaultPreset: "soft",
    labels: { soft: "Soft (défaut)", square: "Square", round: "Round" },
  },
];
