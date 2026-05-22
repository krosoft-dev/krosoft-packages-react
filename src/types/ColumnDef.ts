import React from "react";

export interface ColumnDef<T> {
  key: string;
  label: string;
  defaultVisible?: boolean;
  minWidth?: number;
  sortable?: boolean;
  // Permet de définir un rendu personnalisé pour la cellule
  renderCell?: (row: T) => React.ReactNode;
  // Permet d'extraire une valeur spécifique pour le tri (ex: le premier email d'un tableau)
  getSortValue?: (row: T) => string | number | boolean | null | undefined;
}
