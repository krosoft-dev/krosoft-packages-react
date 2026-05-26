import { ErrorAlert } from "@/components/core/states/ErrorAlert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialogConfig } from "@/types/ConfirmDialogConfig";
import { ErrorHttp } from "@krosoft/core/types";
import { TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteDialogProps {
  isLoading: boolean;
  error: ErrorHttp | Error | null;
  config: ConfirmDialogConfig;
}

export const ConfirmDeleteDialog = ({ isLoading, error, config }: ConfirmDeleteDialogProps) => {
  const { t } = useTranslation();

  const handleOpenChange = (open: boolean) => {
    // Ne permettre la fermeture que si on n'est pas en chargement
    if (!open && !isLoading) {
      config.onClose();
    }
  };

  return (
    <AlertDialog open={config.isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <TrashIcon className="size-4" />
            {t(config.title)}
          </AlertDialogTitle>
          <AlertDialogHeader className="bg-gradient-to-r from-slate-900 to-purple-700 rounded-t-lg shrink-0" />
          <AlertDialogDescription>{t(config.description)}</AlertDialogDescription>
          <AlertDialogDescription>{config.itemName && <span className="font-semibold block my-2">{config.itemName}</span>}</AlertDialogDescription>
        </AlertDialogHeader>
        <ErrorAlert error={error instanceof Error ? null : error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}> {t("common.buttons.cancel")}</AlertDialogCancel>
          <Button
            onClick={e => {
              e.preventDefault();
              config.onConfirm();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
