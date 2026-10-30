/**
 * Entrée d'un journal des modifications, issue d'un titre `##` du markdown :
 * `## [1.3.0] - 2026-10-30 14:41 - Titre`, où la version et le titre sont optionnels.
 */
export interface ChangelogEntry {
  /** Ancre de l'entrée : slug de la date seule (`2026-10-30-1441`), stable si la version ou le titre changent. */
  id: string;
  /** Texte brut du titre `##`. */
  heading: string;
  /** Version (`1.3.0`), lue entre crochets en tête du titre. */
  version?: string;
  /** Titre de l'entrée, placé après la date. Sans date reconnue, c'est le titre `##` entier. */
  title?: string;
  /** Date lue dans le titre ; absente si le titre n'en contient pas. */
  date?: Date;
  /** Vrai si le titre porte une heure (`HH:MM`) en plus de la date. */
  hasTime: boolean;
  /** Markdown de l'entrée, titre exclu. */
  content: string;
}
