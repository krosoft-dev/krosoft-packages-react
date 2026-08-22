import type { Locale } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { KROSOFT_NAMESPACE } from "./krosoftLocales";

/**
 * Correspondance langue → locale date-fns.
 *
 * `enGB` plutôt que `enUS` : les applications du package affichent des dates
 * courtes en JJ/MM/AAAA et des semaines démarrant le lundi, conventions que
 * l'anglais britannique partage avec le français — l'anglais américain les
 * inverserait toutes les deux.
 */
const LOCALES: Record<string, Locale> = { fr, en: enGB };

/** Aligné sur le français embarqué des libellés : même comportement sans i18next. */
const FALLBACK_LOCALE = fr;

/** Résout la locale date-fns d'une langue, région comprise (« en-GB » → `enGB`). */
export const dateFnsLocale = (language?: string): Locale => (language === undefined ? FALLBACK_LOCALE : (LOCALES[language.split("-")[0]] ?? FALLBACK_LOCALE));

/**
 * Locale date-fns suivant la langue de l'application.
 *
 * Même logique que `useKrosoftTranslation` : sans i18next, ou avant son
 * initialisation, on retombe sur le français.
 */
export const useDateFnsLocale = (): Locale => {
  const { i18n, ready } = useTranslation(KROSOFT_NAMESPACE, { useSuspense: false });

  return dateFnsLocale(ready ? (i18n.resolvedLanguage ?? i18n.language) : undefined);
};
