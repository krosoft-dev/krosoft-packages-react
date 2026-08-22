import { useTranslation } from "react-i18next";
import fr from "../locales/fr.json";
import { KROSOFT_NAMESPACE } from "./krosoftLocales";

type InterpolationValues = Record<string, string | number>;

/** Lit une clé pointée dans les traductions françaises embarquées. */
const readBundled = (key: string): string | undefined => {
  const value = key
    .split(".")
    .reduce<unknown>((node, part) => (typeof node === "object" && node !== null ? (node as Record<string, unknown>)[part] : undefined), fr);

  return typeof value === "string" ? value : undefined;
};

/** Interpolation `{{valeur}}`, alignée sur la syntaxe d'i18next. */
const interpolate = (text: string, values?: InterpolationValues): string =>
  values === undefined ? text : text.replace(/\{\{(\w+)\}\}/g, (match, name: string) => (name in values ? String(values[name]) : match));

/**
 * Traduction des libellés propres au package.
 *
 * Deux modes, sans configuration à choisir :
 * - l'application a appelé `registerKrosoftLocales` : les libellés suivent sa
 *   langue et ses éventuelles surcharges ;
 * - elle ne l'a pas fait, ou n'utilise pas i18next : on retombe sur le français
 *   embarqué, ce qui préserve le comportement des applications existantes.
 */
export const useKrosoftTranslation = (): { t: (key: string, values?: InterpolationValues) => string } => {
  const { t, i18n, ready } = useTranslation(KROSOFT_NAMESPACE, { useSuspense: false });

  const translate = (key: string, values?: InterpolationValues): string => {
    // `exists` suit la résolution d'i18next — région puis langue de base puis
    // `fallbackLng`. Comparer `i18n.language` au pied de la lettre ratait les
    // langues régionalisées : une langue détectée depuis le navigateur vaut
    // « en-GB », alors que le bundle est enregistré sous « en ».
    if (ready && i18n.exists(key, { ns: KROSOFT_NAMESPACE })) {
      return t(key, values ?? {});
    }

    return interpolate(readBundled(key) ?? key, values);
  };

  return { t: translate };
};
