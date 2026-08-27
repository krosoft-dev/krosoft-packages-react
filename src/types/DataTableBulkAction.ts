import React from "react";

export interface DataTableBulkAction<T = unknown> {
  // Clé i18n du libellé.
  labelKey: string;
  icon?: React.ElementType;
  // Reçoit les lignes sélectionnées (objets complets, reconstitués même à travers
  // la pagination server-side) et une fonction pour vider la sélection.
  onClick: (selectedRows: T[], clearSelection: () => void) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}
