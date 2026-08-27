import React from "react";

export interface DataTableBulkAction {
  // Clé i18n du libellé.
  labelKey: string;
  icon?: React.ElementType;
  onClick: (selectedIds: string[], clearSelection: () => void) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}
