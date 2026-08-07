import { AppDialog, AppDialogConfig, DialogAction } from "@/components/core/dialogs/AppDialog";
import { Button } from "@/components/ui";
import { Pen, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  saveLabel = "Sauvegarder",
  cancelLabel = "Annuler",
  hideSaveIcon = false,
  maxWidth = "sm:max-w-4xl",
  isLoading = false,
}: FormDialogProps<T>): React.ReactElement | null {
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [submitForm, setSubmitForm] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (open) {
      setIsEditing(defaultEditing);
    }
  }, [open, defaultEditing]);

  if (data === null || data === undefined) return null;

  const handleEditToggle = (): void => {
    if (isEditing) {
      if (onSave !== undefined && submitForm) {
        submitForm();
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  const handleSaveClick = (): void => {
    if (onSave !== undefined && submitForm) {
      submitForm();
    }
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
          label: cancelLabel,
          onClick: handleCancel,
          variant: "outline",
          disabled: isSaving || isLoading,
          icon: X,
        });
      }
      actions.push({
        label: isSaving ? "Enregistrement..." : saveLabel,
        onClick: handleSaveClick,
        variant: "default",
        disabled: isSaving || isLoading,
        icon: hideSaveIcon ? undefined : Save,
      });
    } else {
      actions.push({
        label: "Modifier",
        onClick: handleEditToggle,
        variant: "outline",
        icon: Pen,
      });
    }
  }

  const config: AppDialogConfig = {
    title: title(data),
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
          schema={schema}
          initialData={data}
          disabled={!isEditing}
          onSubmit={(formData: T) => {
            void handleFormSubmit(formData);
          }}
          renderActions={false}
          onRegisterSubmit={submitFn => {
            setSubmitForm(() => submitFn);
          }}
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
                    {cancelLabel}
                  </Button>
                ) : null}
                <Button onClick={handleSaveClick} size="sm" disabled={isSaving || isLoading} className="text-white">
                  {!hideSaveIcon ? <Save className="size-4 mr-2" /> : null}
                  {isSaving ? "Enregistrement..." : saveLabel}
                </Button>
              </>
            ) : (
              <Button onClick={handleEditToggle} variant="outline" size="sm">
                <Pen className="size-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </AppDialog>
  );
}
