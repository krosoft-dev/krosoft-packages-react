import { useKrosoftTranslation } from "@/i18n";
import { AppDialog, AppDialogConfig, AppDialogSize, DialogAction } from "@/components/core/dialogs/AppDialog";
import { Button } from "@/components/ui";
import { Pen, Save, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { GenericForm } from "@/components/core/forms/GenericForm";
import type { FormSchema } from "@/types";

export interface FormDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title: (data: T) => string;
  headerBadge?: (data: T) => React.ReactNode;
  schema: FormSchema<T>;
  onSave?: (data: T) => Promise<void>;
  customFooter?: (data: T) => React.ReactNode;
  defaultEditing?: boolean;
  footerActions?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  hideSaveIcon?: boolean;
  /** Largeur maximale à partir de `sm`. `4xl` par défaut. */
  size?: AppDialogSize;
  /**
   * Classe de largeur brute, breakpoint compris (`"sm:max-w-4xl"`).
   * @deprecated Préférer `size`.
   */
  maxWidth?: string;
  isLoading?: boolean;
}

export default function FormDialog<T>({
  open,
  onOpenChange,
  data,
  title,
  headerBadge,
  schema,
  onSave,
  customFooter,
  defaultEditing = false,
  footerActions = true,
  saveLabel,
  cancelLabel,
  hideSaveIcon = false,
  size = "4xl",
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  maxWidth,
  isLoading = false,
}: FormDialogProps<T>): React.ReactElement | null {
  const { t } = useKrosoftTranslation();
  const save = saveLabel ?? t("actions.save");
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [isSaving, setIsSaving] = useState(false);
  // Le pied de la dialog est rendu hors du `<form>` : les boutons d'enregistrement
  // le visent par `form="<id>"` plutôt que par une fonction de submit remontée.
  const formId = useId();

  useEffect(() => {
    if (open) {
      setIsEditing(defaultEditing);
    }
  }, [open, defaultEditing]);

  if (data === null || data === undefined) return null;

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  const handleFormSubmit = async (formData: T): Promise<void> => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const actions: DialogAction[] = [];
  if (onSave !== undefined) {
    if (isEditing) {
      if (cancelLabel !== "") {
        actions.push({
          label: cancelLabel ?? t("actions.cancel"),
          onClick: handleCancel,
          variant: "outline",
          disabled: isSaving || isLoading,
          icon: X,
        });
      }
      actions.push({
        label: isSaving ? t("actions.saving") : save,
        type: "submit",
        form: formId,
        variant: "default",
        disabled: isSaving || isLoading,
        icon: hideSaveIcon ? undefined : Save,
      });
    } else {
      actions.push({
        label: t("actions.edit"),
        onClick: handleEdit,
        variant: "outline",
        icon: Pen,
      });
    }
  }

  const config: AppDialogConfig = {
    title: title(data),
    size,
    maxWidth,
    actions: footerActions ? actions : [],
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={(isOpen: boolean): void => {
        onOpenChange(isOpen);
        if (!isOpen) handleCancel();
      }}
      config={config}
      isLoading={isSaving || isLoading}
    >
      <div>
        {headerBadge !== undefined ? <div className="mb-4">{headerBadge(data)}</div> : null}

        <GenericForm
          id={formId}
          schema={schema}
          initialData={data}
          disabled={!isEditing}
          onSubmit={(formData: T) => {
            void handleFormSubmit(formData);
          }}
          renderActions={false}
          isLoading={isSaving || isLoading}
        />

        {customFooter !== undefined ? customFooter(data) : null}

        {onSave !== undefined && !footerActions ? (
          <div className="flex justify-end gap-2 border-t pt-4 mt-6">
            {isEditing ? (
              <>
                {cancelLabel !== "" ? (
                  <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving || isLoading}>
                    <X className="size-4 mr-2" />
                    {cancelLabel ?? t("actions.cancel")}
                  </Button>
                ) : null}
                <Button type="submit" form={formId} size="sm" disabled={isSaving || isLoading} className="text-white">
                  {!hideSaveIcon ? <Save className="size-4 mr-2" /> : null}
                  {isSaving ? t("actions.saving") : save}
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Pen className="size-4 mr-2" />
                {t("actions.edit")}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </AppDialog>
  );
}
