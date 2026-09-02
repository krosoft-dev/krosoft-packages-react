import React from "react";

export interface ConfirmDialogConfig {
  isOpen: boolean;
  itemName: string | null;
  title: string;
  description: string;
  confirmKey: string;
  loadingKey?: string;
  icon?: React.ElementType;
  titleClassName?: string;
  openDialog: (id: string, name: string) => void;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}
