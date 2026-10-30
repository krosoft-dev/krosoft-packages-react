/** Élément d'une entrée de journal : un module (tag) et son texte markdown. */
export interface ChangelogItem {
  /** Module issu du préfixe `**Module** :` ; absent pour un texte sans préfixe. */
  tag?: string;
  /** Markdown de l'élément, préfixe retiré. */
  content: string;
}
