import { ConfirmDialogConfig } from "@/types/ConfirmDialogConfig";
import { TrashIcon } from "lucide-react";
import { useConfirmationDialog } from "./useConfirmationDialog";

interface UseConfirmDeleteDialogProps {
  titleKey: string;
  descriptionKey: string;
  confirmKey?: string;
  onConfirm: (id: string) => Promise<any>;
  onReset?: () => void;
}

export const useConfirmDeleteDialog = ({
  titleKey,
  descriptionKey,
  confirmKey = "Supprimer",
  onConfirm,
  onReset,
}: UseConfirmDeleteDialogProps): ConfirmDialogConfig => {
  const config = useConfirmationDialog({
    titleKey,
    descriptionKey,
    confirmKey,
    onConfirm,
    onReset,
  });

  return {
    ...config,
    loadingKey: "Suppression...",
    icon: TrashIcon,
    titleClassName: "flex items-center gap-2 text-destructive",
    headerClassName: "bg-gradient-to-r from-slate-900 to-purple-700 rounded-t-lg shrink-0",
  };
};
