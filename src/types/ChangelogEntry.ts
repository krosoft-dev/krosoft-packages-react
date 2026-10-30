/** Entrée d'un journal des modifications, issue d'un titre `## AAAA-MM-JJ HH:MM` du markdown. */
export interface ChangelogEntry {
  /** Ancre de l'entrée (`2026-10-30-1441`), identique au slug GitHub du titre. */
  id: string;
  /** Texte brut du titre. */
  title: string;
  /** Date lue dans le titre ; absente si le titre n'en contient pas. */
  date?: Date;
  /** Vrai si le titre porte une heure (`HH:MM`) en plus de la date. */
  hasTime: boolean;
  /** Markdown de l'entrée, titre exclu. */
  content: string;
}
