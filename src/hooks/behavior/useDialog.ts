import { useState } from "react";

export interface DialogState {
  id: string | null;
  isOpen: boolean;
  openDialog: (id: string) => void;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const useDialog = (): DialogState => {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
  } | null>(null);

  const openDialog = (id: string): void => {
    setSelectedItem({ id });
  };

  const closeDialog = (): void => {
    setSelectedItem(null);
  };

  const handleDelete = (): void => {
    if (!selectedItem) return;

    closeDialog();
  };

  return {
    id: selectedItem?.id || null,
    isOpen: !!selectedItem,

    openDialog,
    onClose: closeDialog,
    onConfirm: handleDelete,
  };
};
