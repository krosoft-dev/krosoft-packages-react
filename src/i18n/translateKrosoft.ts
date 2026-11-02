import fr from "../locales/fr.json";
import { KROSOFT_NAMESPACE } from "./krosoftLocales";

export type InterpolationValues = Record<string, string | number>;

/** Sous-ensemble d'i18next utile pour traduire hors d'un composant. */
// Syntaxe méthode volontaire : ses paramètres sont bivariants, ce qui laisse passer
// le `TFunction` surchargé d'i18next sans imposer son type complet.
export interface I18nTranslator {
  t(key: string, options?: Record<string, unknown>): string;
  exists(key: string, options?: Record<string, unknown>): boolean;
}

/** Lit une clé pointée dans les traductions françaises embarquées. */
export const readBundled = (key: string): string | undefined => {
  const value = key
    .split(".")
    .reduce<unknown>((node, part) => (typeof node === "object" && node !== null ? (node as Record<string, unknown>)[part] : undefined), fr);

  return typeof value === "string" ? value : undefined;
};

/** Interpolation `{{valeur}}`, alignée sur la syntaxe d'i18next. */
export const interpolate = (text: string, values?: InterpolationValues): string =>
  values === undefined ? text : text.replace(/\{\{(\w+)\}\}/g, (match, name: string) => (name in values ? String(values[name]) : match));

/**
 * Équivalent de `useKrosoftTranslation` hors de React (callbacks d'un `QueryCache`,
 * services…), sur une instance i18next passée explicitement.
 *
 * Même ordre de résolution : namespace de l'application, puis namespace `krosoft`,
 * puis français embarqué, puis la clé elle-même. Sans instance, on retombe
 * directement sur le français embarqué.
 */
export const translateKrosoft = (i18n: I18nTranslator | undefined, key: string, values?: InterpolationValues): string => {
  if (i18n !== undefined) {
    if (i18n.exists(key)) {
      return i18n.t(key, values ?? {});
    }

    if (i18n.exists(key, { ns: KROSOFT_NAMESPACE })) {
      return i18n.t(key, { ...values, ns: KROSOFT_NAMESPACE });
    }
  }

  return interpolate(readBundled(key) ?? key, values);
};
