import { cn } from "@/helpers/tailwind.helper";

/**
 * Gabarit commun des contrôles de formulaire tenant sur une ligne : hauteur, forme,
 * bordure, fond, padding, taille de texte et état désactivé.
 *
 * À réutiliser dès qu'un composant doit s'aligner avec un `Input` ou un `SelectTrigger`
 * (select, multi-select, pastille de filtre…) : c'est ce qui garantit qu'une barre de
 * filtres reste homogène quand on y ajoute un contrôle.
 *
 * La largeur n'en fait volontairement pas partie : chaque composant décide s'il occupe
 * toute la place (`w-full`) ou s'il se dimensionne sur son contenu.
 */
export const controlBaseClass =
  "h-10 rounded-control border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Gabarit des contrôles cliquables qui ouvrent un panneau (select, multi-select,
 * combobox) : `controlBaseClass` + libellé à gauche / chevron à droite + anneau de focus.
 */
export const controlTriggerClass = cn(
  controlBaseClass,
  // Anneau de focus au clavier seulement (`focus-visible`) : après une sélection à la souris,
  // Radix rend le focus au trigger, et `focus:` laisserait alors l'anneau coloré persister.
  "flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>span]:line-clamp-1",
);
