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
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  isLoading: boolean;
  error: ErrorHttp | Error | null;
  config: ConfirmDialogConfig | null;
  destructive?: boolean;
}

export function ConfirmationDialog({ isLoading, error, config, destructive = false }: ConfirmationDialogProps) {
  const { t } = useTranslation();

  if (!config) return null;

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
          <AlertDialogTitle className={config.titleClassName}>
            {config.icon && <config.icon className="size-4" />}
            {t(config.title)}
          </AlertDialogTitle>
          {config.headerClassName && <AlertDialogHeader className={config.headerClassName} />}
          <AlertDialogDescription>{t(config.description)}</AlertDialogDescription>
          {config.itemName && (
            <AlertDialogDescription>
              <span className="font-semibold block my-2">{config.itemName}</span>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <ErrorAlert error={error instanceof Error ? null : error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t("common.buttons.cancel")}</AlertDialogCancel>
          <Button
            onClick={e => {
              e.preventDefault();
              config.onConfirm();
            }}
            disabled={isLoading}
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {isLoading ? t(config.loadingKey || "common.buttons.loading") : config.confirmKey}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
