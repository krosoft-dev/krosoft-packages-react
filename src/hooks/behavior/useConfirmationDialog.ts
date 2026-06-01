import { ConfirmDialogConfig } from "@/types/ConfirmDialogConfig";
import { useState } from "react";

interface UseConfirmationDialogProps {
  titleKey: string;
  descriptionKey: string;
  confirmKey?: string;
  onConfirm: (id: string) => Promise<any>;
  onReset?: () => void;
}

export const useConfirmationDialog = ({
  titleKey,
  descriptionKey,
  confirmKey = "Confirmer",
  onConfirm,
  onReset,
}: UseConfirmationDialogProps): ConfirmDialogConfig => {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openDialog = (id: string, name: string) => {
    onReset?.();
    setSelectedItem({ id, name });
  };

  const closeDialog = () => {
    setSelectedItem(null);
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      await onConfirm(selectedItem.id);
      closeDialog();
    } catch (error) {
      // L'erreur est gérée par le hook parent et affichée dans le dialog
      // On ne ferme pas le dialog en cas d'erreur
      console.error("Error confirming action:", error);
    }
  };

  return {
    isOpen: !!selectedItem,
    itemName: selectedItem?.name ?? null,
    title: titleKey,
    description: descriptionKey,
    confirmKey,
    openDialog,
    onClose: closeDialog,
    onConfirm: handleConfirm,
  };
};
