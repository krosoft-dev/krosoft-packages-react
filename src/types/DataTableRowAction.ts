import React from "react";

export interface DataTableRowAction<T> {
  // Clé i18n du libellé.
  labelKey: string;
  icon?: React.ElementType;
  onClick: (row: T) => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  // Permet de masquer l'action au cas par cas selon la ligne
  visible?: (row: T) => boolean;
  // Permet de désactiver l'action au cas par cas selon la ligne
  disabled?: (row: T) => boolean;
  // Si vrai, l'action est placée dans le menu kebab plutôt qu'affichée en ligne
  overflow?: boolean;
}
