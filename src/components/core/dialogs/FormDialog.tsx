import { AppDialog, AppDialogConfig, DialogAction } from "@/components/core/dialogs/AppDialog";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Pen, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface FieldDef<T> {
  key: string;
  label: string;
  fullWidth?: boolean;
  renderView?: (data: T) => React.ReactNode;
  renderEdit?: (data: T, editedData: Partial<T>, onChange: (val: unknown) => void) => React.ReactNode;
  getEditValue?: (data: T) => unknown;
}

export interface SectionDef<T> {
  title: string;
  icon?: React.ReactNode;
  fields: FieldDef<T>[];
}

interface FormDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title: (data: T) => string;
  headerBadge?: (data: T) => React.ReactNode;
  sections: SectionDef<T>[];
  onSave?: (editedData: Partial<T>) => Promise<void>;
  customFooter?: (data: T) => React.ReactNode;
  defaultEditing?: boolean;
  footerActions?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  hideSaveIcon?: boolean;
  maxWidth?: string;
}

export default function FormDialog<T>({
  open,
  onOpenChange,
  data,
  title,
  headerBadge,
  sections,
  onSave,
  customFooter,
  defaultEditing = false,
  footerActions = true,
  saveLabel = "Sauvegarder",
  cancelLabel = "Annuler",
  hideSaveIcon = false,
  maxWidth = "sm:max-w-4xl",
}: FormDialogProps<T>): React.ReactElement | null {
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [editedData, setEditedData] = useState<Partial<T>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setIsEditing(defaultEditing);
    }
  }, [open, defaultEditing]);

  if (data === null || data === undefined) return null;

  const handleEditToggle = async (): Promise<void> => {
    if (isEditing) {
      if (onSave !== undefined) {
        setIsSaving(true);
        try {
          await onSave(editedData);
          setIsEditing(false);
          setEditedData({});
        } catch (error) {
          console.error(error);
        } finally {
          setIsSaving(false);
        }
      }
    } else {
      setIsEditing(true);
      setEditedData({});
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleSaveClick = async (): Promise<void> => {
    if (onSave === undefined) return;

    setIsSaving(true);
    try {
      await onSave(editedData);
      setIsEditing(false);
      setEditedData({});
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (key: string, value: unknown): void => {
    setEditedData(prev => ({ ...prev, [key]: value }));
  };

  const renderFieldContent = (field: FieldDef<T>): React.ReactNode => {
    if (isEditing && onSave !== undefined) {
      if (field.renderEdit !== undefined) {
        return field.renderEdit(data, editedData, (val: unknown): void => {
          handleFieldChange(field.key, val);
        });
      }

      let inputValue = "";
      if (editedData[field.key as keyof T] !== undefined) {
        inputValue = editedData[field.key as keyof T] as string;
      } else if (field.getEditValue !== undefined) {
        inputValue = field.getEditValue(data) as string;
      } else {
        const val = data[field.key as keyof T];
        inputValue = val !== undefined && val !== null && String(val) !== "" ? String(val) : "";
      }

      return (
        <Input
          value={inputValue}
          onChange={(e): void => {
            handleFieldChange(field.key, e.target.value);
          }}
        />
      );
    }

    if (field.renderView !== undefined) {
      return field.renderView(data);
    }

    const value = data[field.key as keyof T];
    let displayValue: React.ReactNode = "Non renseigné";

    if (Array.isArray(value)) {
      if (value.length > 0) {
        const stringifiedArray = value.map(item => {
          if (typeof item === "object" && item !== null) {
            const obj = item as Record<string, unknown>;
            if (typeof obj.name === "string") return obj.name;
            if (typeof obj.label === "string") return obj.label;
            return JSON.stringify(item);
          }
          return String(item);
        });
        displayValue = stringifiedArray.join(", ");
      }
    } else if (typeof value === "object" && value !== null) {
      displayValue = JSON.stringify(value);
    } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      displayValue = String(value);
    }

    return <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-transparent min-h-[36px] flex items-center">{displayValue}</div>;
  };

  const renderField = (field: FieldDef<T>): React.ReactElement => {
    return (
      <div key={field.key} className={`col-span-1 ${field.fullWidth === true ? "md:col-span-2" : ""}`}>
        <Label className="mb-1 block text-sm font-medium">{field.label}</Label>
        {renderFieldContent(field)}
      </div>
    );
  };

  const actions: DialogAction[] = [];
  if (onSave !== undefined) {
    if (isEditing) {
      if (cancelLabel !== "") {
        actions.push({
          label: cancelLabel,
          onClick: handleCancel,
          variant: "outline",
          disabled: isSaving,
          icon: X,
        });
      }
      actions.push({
        label: isSaving ? "Enregistrement..." : saveLabel,
        onClick: () => {
          void handleSaveClick();
        },
        variant: "default",
        disabled: isSaving,
        icon: hideSaveIcon ? undefined : Save,
      });
    } else {
      actions.push({
        label: "Modifier",
        onClick: () => {
          void handleEditToggle();
        },
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
      isLoading={isSaving}
    >
      <div className="py-4">
        {headerBadge !== undefined ? <div className="mb-4">{headerBadge(data)}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {section.icon}
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">{section.fields.map(renderField)}</div>
            </div>
          ))}
        </div>

        {customFooter !== undefined ? customFooter(data) : null}

        {onSave !== undefined && !footerActions ? (
          <div className="flex justify-end gap-2 border-t pt-4 mt-6">
            {isEditing ? (
              <>
                {cancelLabel !== "" ? (
                  <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                    <X className="size-4 mr-2" />
                    {cancelLabel}
                  </Button>
                ) : null}
                <Button
                  onClick={(): void => {
                    void handleSaveClick();
                  }}
                  size="sm"
                  disabled={isSaving}
                  className="text-white"
                >
                  {!hideSaveIcon ? <Save className="size-4 mr-2" /> : null}
                  {isSaving ? "Enregistrement..." : saveLabel}
                </Button>
              </>
            ) : (
              <Button
                onClick={(): void => {
                  void handleEditToggle();
                }}
                variant="outline"
                size="sm"
              >
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
