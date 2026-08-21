import en from "../locales/en.json";
import fr from "../locales/fr.json";

/**
 * Namespace i18next réservé aux libellés du package : boutons « Annuler »,
 * « Aucun résultat », placeholders de recherche… Séparé du namespace de
 * l'application pour qu'aucune clé ne se marche dessus.
 */
export const KROSOFT_NAMESPACE = "krosoft";

/** Traductions embarquées, exportées pour être fusionnées ou surchargées côté application. */
export const krosoftLocales = { fr, en };

/** Sous-ensemble d'i18next dont on a besoin : évite d'imposer le type complet de l'instance. */
interface I18nLike {
  addResourceBundle?: (lng: string, ns: string, resources: object, deep?: boolean, overwrite?: boolean) => unknown;
  hasResourceBundle?: (lng: string, ns: string) => boolean;
}

/**
 * Enregistre les traductions du package sur l'instance i18next de l'application.
 *
 * À appeler une fois après l'init d'i18next :
 *
 * ```ts
 * import i18n from "i18next";
 * import { registerKrosoftLocales } from "@krosoft/react/i18n";
 *
 * registerKrosoftLocales(i18n);
 * ```
 *
 * Sans cet appel, les composants retombent sur le français embarqué : le
 * comportement des applications existantes reste inchangé.
 *
 * @param overwrite Écrase les clés déjà présentes. Faux par défaut, afin qu'une
 * application qui a personnalisé un libellé garde le sien.
 */
export const registerKrosoftLocales = (i18n: I18nLike, { overwrite = false }: { overwrite?: boolean } = {}): void => {
  if (typeof i18n.addResourceBundle !== "function") return;

  Object.entries(krosoftLocales).forEach(([language, resources]) => {
    i18n.addResourceBundle?.(language, KROSOFT_NAMESPACE, resources, true, overwrite);
  });
};
