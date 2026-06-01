import { useState } from "react";

export interface DialogState {
  id: string | null;
  name: string | null;
  isOpen: boolean;
  openDialog: (id: string, name: string) => void;
  onClose: () => void;
}

interface UseDialogProps {
  onReset?: () => void;
}

export const useDialog = (props?: UseDialogProps): DialogState => {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openDialog = (id: string, name: string): void => {
    props?.onReset?.();
    setSelectedItem({ id, name });
  };

  const closeDialog = (): void => {
    setSelectedItem(null);
  };

  return {
    id: selectedItem?.id ?? null,
    name: selectedItem?.name ?? null,
    isOpen: !!selectedItem,
    openDialog,
    onClose: closeDialog,
  };
};
