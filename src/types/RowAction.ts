import React from "react";

export interface RowAction<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (row: T) => void;
  className?: string;
}
