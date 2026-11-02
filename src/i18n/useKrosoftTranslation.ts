import { useTranslation } from "react-i18next";
import { KROSOFT_NAMESPACE } from "./krosoftLocales";
import { type InterpolationValues, interpolate, readBundled } from "./translateKrosoft";

/**
 * Traduction unifiée du package : un seul `t`, que la clé vienne de
 * l'application (`headerKey`, `labelKey`, `emptyKey`…) ou du package lui-même.
 *
 * Résolution, dans l'ordre :
 * 1. le namespace de l'application — une clé qu'elle a enregistrée (ou une
 *    surcharge d'un libellé du package) gagne toujours ;
 * 2. le namespace `krosoft`, si l'application a appelé `registerKrosoftLocales` :
 *    les libellés du package suivent alors sa langue ;
 * 3. le français embarqué du package ;
 * 4. la clé elle-même — le repli i18next habituel.
 */
export const useKrosoftTranslation = (): { t: (key: string, values?: InterpolationValues) => string } => {
  const { t: tKrosoft, i18n, ready } = useTranslation(KROSOFT_NAMESPACE, { useSuspense: false });
  const { t: tApp } = useTranslation(undefined, { useSuspense: false });

  const translate = (key: string, values?: InterpolationValues): string => {
    // `exists` suit la résolution d'i18next — région puis langue de base puis
    // `fallbackLng`. Comparer `i18n.language` au pied de la lettre ratait les
    // langues régionalisées : une langue détectée depuis le navigateur vaut
    // « en-GB », alors que le bundle est enregistré sous « en ».
    if (ready && i18n.exists(key)) {
      return tApp(key, values ?? {});
    }

    if (ready && i18n.exists(key, { ns: KROSOFT_NAMESPACE })) {
      return tKrosoft(key, values ?? {});
    }

    return interpolate(readBundled(key) ?? key, values);
  };

  return { t: translate };
};
