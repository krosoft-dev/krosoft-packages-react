import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConfirmDialogConfig } from "@/types/ConfirmDialogConfig";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  config: ConfirmDialogConfig | null;
  destructive?: boolean;
}

export function ConfirmationDialog({ config, destructive = false }: ConfirmationDialogProps) {
  const { t } = useTranslation();

  if (!config) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      config.onClose();
    }
  };

  return (
    <AlertDialog open={config.isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(config.title)}</AlertDialogTitle>
          <AlertDialogDescription>{t(config.description)}</AlertDialogDescription>
          {config.itemName && (
            <AlertDialogDescription>
              <span className="font-semibold block my-2">{config.itemName}</span>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.buttons.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              config.onConfirm();
            }}
            className={destructive ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {config.confirmKey}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
