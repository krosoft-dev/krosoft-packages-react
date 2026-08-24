import { useKrosoftTranslation } from "@/i18n";
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

export const useConfirmDeleteDialog = ({ titleKey, descriptionKey, confirmKey, onConfirm, onReset }: UseConfirmDeleteDialogProps): ConfirmDialogConfig => {
  const { t } = useKrosoftTranslation();
  const config = useConfirmationDialog({
    titleKey,
    descriptionKey,
    confirmKey: confirmKey ?? t("actions.delete"),
    onConfirm,
    onReset,
  });

  return {
    ...config,
    loadingKey: "Suppression...",
    icon: TrashIcon,
    titleClassName: "flex items-center gap-2 text-destructive",
    headerClassName: "bg-gradient-to-r from-slate-900 to-purple-700 rounded-t-surface shrink-0",
  };
};
