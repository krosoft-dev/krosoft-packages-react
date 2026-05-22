import React from "react";

export interface BulkAction {
  label: string;
  icon?: React.ElementType;
  onClick: (selectedIds: string[], clearSelection: () => void) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}
