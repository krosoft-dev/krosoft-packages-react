import { ConfirmDialogConfig } from "@/types/ConfirmDialogConfig";
import { useDialog } from "./useDialog";

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
  const dialog = useDialog({ onReset });

  const handleConfirm = async () => {
    if (!dialog.id) return;

    try {
      await onConfirm(dialog.id);
      dialog.onClose();
    } catch (error) {
      // L'erreur est gérée par le hook parent et affichée dans le dialog
      // On ne ferme pas le dialog en cas d'erreur
      console.error("Error confirming action:", error);
    }
  };

  return {
    isOpen: dialog.isOpen,
    itemName: dialog.name,
    title: titleKey,
    description: descriptionKey,
    confirmKey,
    openDialog: dialog.openDialog,
    onClose: dialog.onClose,
    onConfirm: handleConfirm,
  };
};
