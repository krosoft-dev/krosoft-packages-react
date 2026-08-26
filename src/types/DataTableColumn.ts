import React from "react";

export interface ColumnDef<T> {
  key: string;
  // Clé i18n de l'en-tête.
  headerKey: string;
  defaultVisible?: boolean;
  minWidth?: number;
  sortable?: boolean;
  // Fige la colonne sur un bord du tableau : elle reste visible pendant le défilement horizontal,
  // en-tête compris. Une colonne figée n'est pas déplaçable au glisser-déposer.
  fixed?: "left" | "right";
  // Aligne le contenu de la colonne, en-tête compris. Déduit de `className` s'il porte déjà
  // `text-right` ou `text-center`.
  align?: "left" | "center" | "right";
  // Classe CSS appliquée à l'en-tête et aux cellules de la colonne
  className?: string;
  // Permet de définir un rendu personnalisé pour la cellule
  renderCell?: (row: T) => React.ReactNode;
  // Permet d'extraire une valeur spécifique pour le tri (ex: le premier email d'un tableau)
  getSortValue?: (row: T) => string | number | boolean | null | undefined;
}
