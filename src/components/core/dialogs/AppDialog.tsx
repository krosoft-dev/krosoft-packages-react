import { Button, buttonVariants } from "@/components/ui";
import { ErrorAlert } from "@/components/core/states/ErrorAlert";
import { cn } from "@/helpers/tailwind.helper";
import { useKrosoftTranslation } from "@/i18n";
import { ErrorHttp } from "@krosoft/core/types";
import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Progress } from "../../ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";

/** Dérivé de `buttonVariants` : un variant ajouté au `Button` devient utilisable ici sans rien recopier. */
export type ButtonVariantType = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

export type AppDialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";

/**
 * Largeurs à partir de `sm` seulement : en dessous, la dialog est plein écran
 * (voir `dialogContentSizing` dans `ui/dialog`), la contraindre la rendrait
 * illisible sur mobile.
 */
const SIZE_CLASS: Record<AppDialogSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  full: "sm:max-w-[95vw]",
};

export interface DialogAction {
  /** Clé de rendu. À défaut, le libellé sert de clé : à renseigner si deux actions partagent le même. */
  id?: string;
  /** Clé i18n, ou libellé déjà résolu — le repli i18next renvoie la chaîne telle quelle. */
  label: string;
  onClick?: () => void;
  variant?: ButtonVariantType;
  disabled?: boolean;
  icon?: React.ElementType;
  className?: string;
  /**
   * `"submit"` combiné à `form` soumet un formulaire rendu dans `children` : c'est
   * ce qui évite de remonter le `submit` du formulaire jusqu'au pied de la dialog.
   */
  type?: "button" | "submit";
  /** `id` du `<form>` visé par une action `"submit"`. */
  form?: string;
  /**
   * Désactivation automatique pendant `isLoading`. Passer `false` pour une action
   * qui doit rester atteignable pendant le chargement (« Annuler » d'un envoi long).
   */
  disableOnLoading?: boolean;
}

export interface AppDialogConfig {
  /** Une chaîne est traitée comme une clé i18n ; passer un `ReactNode` pour un libellé métier à ne pas traduire. */
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  /** Largeur maximale à partir de `sm`. `xl` par défaut. */
  size?: AppDialogSize;
  /**
   * Classe de largeur brute, breakpoint compris (`"sm:max-w-4xl"`).
   * @deprecated Préférer `size`, qui n'oblige pas à connaître le gabarit interne.
   */
  maxWidth?: string;
  /** Ignoré si un `footer` est fourni au composant. */
  actions?: DialogAction[];
  headerClassName?: string;
  footerClassName?: string;
}

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AppDialogConfig;
  /** Affiche une barre de progression, désactive les actions et verrouille la fermeture. */
  isLoading?: boolean;
  error?: ErrorHttp | Error | null;
  /** Pied de dialog libre, prioritaire sur `config.actions`. */
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function AppDialog({ open, onOpenChange, config, isLoading, error, footer, className, children }: AppDialogProps): React.ReactElement {
  const { t } = useKrosoftTranslation();
  // Seul point du package qui lit encore `maxWidth` : c'est ici que l'échappatoire dépréciée est résolue.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const { title, description, icon: Icon, size = "xl", maxWidth, actions, headerClassName, footerClassName } = config;
  const loading = isLoading === true;

  /** Une chaîne passe par i18next (repli sur elle-même) ; un `ReactNode` est rendu tel quel. */
  const translate = (value: React.ReactNode): React.ReactNode => (typeof value === "string" ? t(value) : value);

  /**
   * Même règle que `ConfirmationDialog` : tant qu'une opération est en cours, ni
   * l'échap, ni le clic sur l'overlay, ni la croix ne referment la dialog — la
   * refermer laisserait l'utilisateur sans retour sur ce qui est en train de partir.
   */
  const handleOpenChange = (next: boolean): void => {
    if (!next && loading) {
      return;
    }
    onOpenChange(next);
  };

  const hasFooter = footer !== undefined || (actions !== undefined && actions.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[100dvh] sm:max-h-[90vh] border-0 shadow-2xl p-0 flex flex-col overflow-hidden",
          // Croix de fermeture de `DialogContent` : elle hérite sinon de la couleur
          // du texte et devient illisible sur l'en-tête sombre en thème clair.
          "[&>button]:text-brand-foreground [&>button]:focus:ring-brand-foreground",
          loading && "[&>button]:pointer-events-none [&>button]:opacity-40",
          maxWidth ?? SIZE_CLASS[size],
          className,
        )}
      >
        {loading ? (
          <div className="absolute top-0 left-0 right-0 z-10">
            <Progress indeterminate className="h-1 rounded-none" />
          </div>
        ) : null}
        <DialogHeader
          className={cn("bg-gradient-to-r from-brand-from to-brand-to p-4 sm:p-6 pr-12 sm:pr-12 sm:rounded-t-surface shrink-0", headerClassName)}
        >
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-brand-foreground">
            {Icon !== undefined ? (
              <div className="p-2 bg-brand-foreground/20 rounded-control">
                <Icon className="size-4 text-brand-foreground" />
              </div>
            ) : null}

            {translate(title)}
          </DialogTitle>
          {description !== undefined && description !== "" ? (
            <DialogDescription className="text-brand-foreground/80 text-base">{translate(description)}</DialogDescription>
          ) : null}
        </DialogHeader>

        {error ? (
          <div className="px-4 sm:px-6 pt-4">
            <ErrorAlert error={error} className="max-w-full" />
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">{children}</div>

        {hasFooter ? (
          <div className={cn("sm:rounded-b-surface border-t border-border bg-muted/40 shrink-0 p-4 sm:p-6", footerClassName)}>
            {footer ?? (
              <div className="flex justify-end gap-3">
                {actions?.map(action => (
                  <Button
                    key={action.id ?? action.label}
                    type={action.type ?? "button"}
                    form={action.form}
                    variant={action.variant ?? "default"}
                    onClick={action.onClick}
                    disabled={action.disabled === true || (loading && action.disableOnLoading !== false)}
                    className={action.className}
                  >
                    {action.icon !== undefined ? <action.icon className="size-4" /> : null}
                    {t(action.label)}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
