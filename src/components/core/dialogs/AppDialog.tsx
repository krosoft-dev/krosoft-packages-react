import { Alert, AlertDescription, Button } from "@/components/ui";
import { AlertCircleIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Progress } from "../../ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./Dialog";

export type ButtonVariantType = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "styled";

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariantType;
  disabled?: boolean;
  icon?: React.ElementType;
  className?: string;
}

export interface AppDialogConfig {
  title: string;
  description?: string;
  icon?: React.ElementType;
  maxWidth?: string;
  actions?: DialogAction[];
}

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AppDialogConfig;
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
}

export function AppDialog({ open, onOpenChange, config, isLoading, error, children }: AppDialogProps): React.ReactElement {
  const { t } = useTranslation();
  const { title, description, icon: Icon, maxWidth = "sm:max-w-xl", actions } = config;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[90vh] border-0 shadow-2xl p-0 flex flex-col`}>
        <DialogHeader className="bg-gradient-to-r from-slate-900 to-purple-700 p-6 rounded-t-lg shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
            {Icon !== undefined ? (
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="size-4 text-white" />
              </div>
            ) : null}

            {t(title)}
          </DialogTitle>
          {description !== undefined && description !== "" ? (
            <DialogDescription className="text-indigo-100 text-base">{t(description)}</DialogDescription>
          ) : null}
        </DialogHeader>
        {isLoading === true ? (
          <div className="absolute top-0 left-0 right-0">
            <Progress indeterminate className="h-1 rounded-none transition-all duration-300" />
          </div>
        ) : null}
        {error !== null && error !== undefined ? (
          <div className="px-6  ">
            <Alert variant="destructive" className="max-w-full">
              <AlertCircleIcon className="size-4" />
              <AlertDescription className="break-words overflow-wrap-anywhere max-w-full">{error.message}</AlertDescription>
            </Alert>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6  ">{children}</div>

        {actions !== undefined && actions.length > 0 ? (
          <div className="rounded-b-lg border-t border-gray-200 dark:border-gray-700 shrink-0 p-6 light:bg-gradient-to-r light:from-gray-50 light:to-gray-100 dark:bg-gray-950">
            <div className="flex justify-end gap-3">
              {actions.map((action, index) => (
                <Button key={index} variant={action.variant ?? "default"} onClick={action.onClick} disabled={action.disabled === true || isLoading === true}>
                  {action.icon !== undefined ? <action.icon className="size-4" /> : null}
                  {t(action.label)}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
