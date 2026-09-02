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

/**
 * Largeur d'un contrôle posé dans une barre de filtres (`variant="filter"`, pastille `"pill"`).
 *
 * Deux paliers parce qu'une barre de filtres n'a pas la même forme selon la place : empilée en
 * colonne sur mobile, où chaque contrôle prend toute la largeur, et alignée en ligne au-delà de
 * `md`, où une largeur fixe garde les contrôles d'aplomb quel que soit leur contenu — sans elle,
 * le `w-full` du trigger renvoie chaque filtre sur sa propre ligne.
 *
 * C'est un défaut, pas une contrainte : un `className` l'écrase (`cn` passe par `tailwind-merge`).
 * Comme elle porte un palier `md:`, une largeur de remplacement doit elle aussi le cibler
 * (`md:w-52`) : sans ce palier, elle ne vaudrait que sous le point de rupture.
 */
export const controlFilterWidthClass = "w-full md:w-[200px]";
