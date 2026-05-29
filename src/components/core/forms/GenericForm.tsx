import { ImageInput } from "@/components/core/inputs/ImageInput";
import { MultiSelect } from "@/components/core/inputs/MultiSelect";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  FormField as UIFormField,
} from "@/components/ui";
import { cn } from "@/helpers/tailwind.helper";

import { FormField, FormSchema, FormSection, HtmlFormField, ImageFormField, NumberFormField, SelectFormField } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, ControllerRenderProps, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

/**
 * Props mapping for the GenericForm component.
 */
interface GenericFormProps<T> {
  /**
   * The structural schema definition containing sections and form fields.
   */
  schema: FormSchema<T>;
  /**
   * Indicates if the form submission or data fetching is loading.
   */
  isLoading?: boolean;
  /**
   * An optional external error object (e.g. from an API request) to display.
   */
  error?: Error | null;
  /**
   * Callback triggered when form values pass validation and are submitted.
   */
  onSubmit: (data: T) => void | Promise<void>;
  /**
   * Callback triggered when the cancel button is clicked.
   */
  onCancel?: () => void;
  /**
   * Default initial values for the form fields.
   */
  initialData?: T;
  /**
   * Disables all interactive fields within the form.
   */
  disabled?: boolean;
  /**
   * If true, renders the default form footer actions (Cancel and Submit).
   * Set this to false when embedding in modals or external layouts.
   */
  renderActions?: boolean;
  /**
   * Callback that exposes the internal submit function to a parent component (like a modal dialog).
   */
  onRegisterSubmit?: (submit: () => void) => void;
  /**
   * The default column span (1 to 4) for fields that do not explicitly declare a layout.cols property.
   * Defaults to 4 (full width).
   */
  defaultCols?: 1 | 2 | 3 | 4;
}

/**
 * A highly dynamic, Zod-validated generic form generator.
 * Builds responsive input layouts automatically based on a structured FormSchema definition.
 */
export const GenericForm = <T,>({
  schema,
  isLoading,
  error,
  onSubmit,
  onCancel,
  initialData,
  disabled = false,
  renderActions = true,
  onRegisterSubmit,
  defaultCols = 4,
}: GenericFormProps<T>): React.ReactElement => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getColSpanClass = (cols: number): string => {
    switch (cols) {
      case 1:
        return "md:col-span-1 col-span-4";
      case 2:
        return "md:col-span-2 col-span-4";
      case 3:
        return "md:col-span-3 col-span-4";
      case 4:
      default:
        return "md:col-span-4 col-span-4";
    }
  };

  const buildZodSchema = (): z.ZodObject<Record<string, z.ZodType>> => {
    const schemaFields: Record<string, z.ZodType> = {};

    schema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.rules) {
          schemaFields[field.key as string] = field.rules(z);
        } else {
          switch (field.type) {
            case "checkbox":
              schemaFields[field.key as string] = z.boolean().nullable().optional();
              break;
            case "html":
              break;
            case "text":
            case "textarea":
            case "number":
            case "date":
            case "time":
            case "select":
            case "multiSelect":
            case "color":
            case "image":
              schemaFields[field.key as string] = z.string().nullable().optional();
              break;
          }
        }
      });
    });

    return z.object(schemaFields);
  };

  const zodSchema = buildZodSchema();

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues:
      (initialData as unknown as Record<string, unknown>) ||
      Object.fromEntries(schema.sections.flatMap(section => section.fields.map(field => [field.key, field.defaultValue ?? null]))),
  });

  // Register submit function with parent
  useState(() => {
    if (onRegisterSubmit) {
      onRegisterSubmit(() => void form.handleSubmit(handleSubmitWithValidation as unknown as (data: Record<string, unknown>) => Promise<void>)());
    }
  });

  const handleSubmitWithValidation = async (data: T): Promise<void> => {
    if (isSubmitting) return;

    const hasErrors = Object.keys(form.formState.errors).length > 0;
    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(data));
    } catch (err) {
      console.error("Error during form submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField<T>, formField: ControllerRenderProps<Record<string, unknown>, string>): React.ReactElement | null => {
    const hasError = !!form.formState.errors[field.key as string];
    const isFieldDisabled = disabled;

    switch (field.type) {
      case "text":
      case "color":
        return (
          <Input
            type={field.type}
            {...formField}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ""}
            className={cn(hasError && "border-destructive")}
            disabled={isFieldDisabled}
            value={(formField.value as string | undefined) ?? ""}
          />
        );
      case "image": {
        const imageField = field as ImageFormField<T>;
        const imageValue = imageField.value !== undefined ? imageField.value : (formField.value as string | undefined);
        return (
          <ImageInput
            value={imageValue ?? ""}
            onChange={file => {
              if (imageField.onChange) imageField.onChange(file);
              // Also update form formField value, maybe store URL or File.
              formField.onChange(file);
            }}
            accept={imageField.accept}
            maxSizeMB={imageField.maxSizeMB}
            hint={imageField.hint}
            disabled={isFieldDisabled}
            className={cn(hasError && "border-destructive")}
          />
        );
      }
      case "date":
        return (
          <Input
            type="date"
            {...formField}
            className={cn(hasError && "border-destructive")}
            disabled={isFieldDisabled}
            value={(formField.value as string | undefined) ?? ""}
          />
        );
      case "time":
        return (
          <Input
            type="time"
            {...formField}
            className={cn(hasError && "border-destructive")}
            disabled={isFieldDisabled}
            value={(formField.value as string | undefined) ?? ""}
          />
        );
      case "checkbox":
        return (
          <div key={field.key as string} className="flex items-center space-x-2">
            <Checkbox
              id={field.key as string}
              checked={formField.value === true}
              onCheckedChange={checked => {
                formField.onChange(checked);
              }}
              disabled={isFieldDisabled}
              className={cn(hasError && "border-destructive")}
            />
            <label htmlFor={field.key as string} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t(field.labelKey)}
            </label>
          </div>
        );
      case "textarea":
        return (
          <Textarea
            {...formField}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ""}
            className={cn(hasError && "border-destructive", "min-h-[100px]")}
            disabled={isFieldDisabled}
            value={(formField.value as string | undefined) ?? ""}
          />
        );
      case "number": {
        const numberField = field as NumberFormField<T>;
        return (
          <Input
            type="number"
            {...formField}
            step={numberField.step}
            min={numberField.min}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ""}
            className={cn(hasError && "border-destructive")}
            disabled={isFieldDisabled}
            value={(formField.value as number | undefined) ?? ""}
            onChange={e => {
              const value = e.target.value === "" ? "" : Number(e.target.value);
              formField.onChange(value);
            }}
          />
        );
      }
      case "select": {
        const selectField = field as SelectFormField<T>;
        const currentValue = formField.value === null || formField.value === undefined ? "" : (formField.value as string);
        const selectOptions = selectField.options as { value: string; label: string; color?: string }[];
        const selectedOption = selectOptions.find(opt => opt.value === currentValue);

        return (
          <Select value={currentValue} onValueChange={formField.onChange} disabled={isFieldDisabled}>
            <FormControl>
              <SelectTrigger className={cn(hasError && "border-destructive")}>
                <SelectValue placeholder={field.placeholderKey ? t(field.placeholderKey) : ""}>
                  {selectedOption ? (
                    <div className="flex items-center gap-2">
                      {selectedOption.color && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedOption.color }} />}
                      {selectedOption.label}
                    </div>
                  ) : undefined}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectOptions.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.color && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }} />}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "multiSelect": {
        const multiSelectField = field as SelectFormField<T>;
        const currentArr = (formField.value as string[] | undefined) ?? [];
        return (
          <MultiSelect
            options={multiSelectField.options}
            selected={currentArr}
            onToggle={val => {
              const updated = currentArr.includes(val) ? currentArr.filter(v => v !== val) : [...currentArr, val];
              formField.onChange(updated);
            }}
            onClear={() => {
              formField.onChange([]);
            }}
            onSelectAll={vals => {
              formField.onChange(vals);
            }}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ""}
            disabled={isFieldDisabled}
          />
        );
      }
      case "html": {
        const htmlField = field as HtmlFormField<T>;
        return <>{htmlField.render(form.getValues() as T, field)}</>;
      }
      default:
        return null;
    }
  };

  const hasMinRule = (rules?: (_z: typeof z) => z.ZodType): boolean => {
    if (!rules) return false;
    const rulesSchema = rules(z);
    if (rulesSchema.safeParse(undefined).success) return false;
    const def = (rulesSchema as unknown as { _def: { checks?: { kind: string }[] } })._def;
    return def.checks?.some(check => check.kind === "min") ?? false;
  };

  const renderSection = (section: FormSection<T>, index: number): React.ReactElement => {
    const content = (
      <div className={cn(`grid grid-cols-4 gap-4`)}>
        {section.fields.map(field => (
          <UIFormField
            key={field.key as string}
            control={form.control}
            name={field.key as string}
            render={({ field: formField }) => (
              <FormItem className={cn(getColSpanClass(field.layout?.cols ?? defaultCols))}>
                {field.type !== "checkbox" && field.type !== "html" && (
                  <FormLabel>
                    {t(field.labelKey)}
                    {hasMinRule(field.rules) && <span className="text-destructive ml-1">*</span>}
                  </FormLabel>
                )}
                <FormControl>{renderField(field, formField)}</FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    );

    const sectionTitle = section.title ?? (section.titleKey ? t(section.titleKey) : null);
    const hasHeader = sectionTitle ?? section.icon;

    if (schema.useCards === false) {
      return (
        <div key={index} className="space-y-4 mb-6">
          {hasHeader && (
            <div className="flex items-center gap-2 mb-4">
              {section.icon}
              <h3 className="text-lg font-semibold">{sectionTitle}</h3>
            </div>
          )}
          {content}
        </div>
      );
    }

    return (
      <Card key={index} className="mb-6">
        {hasHeader && (
          <CardHeader>
            <div className="flex items-center gap-2">
              {section.icon}
              {sectionTitle && <h3 className="text-lg font-semibold">{sectionTitle}</h3>}
            </div>
          </CardHeader>
        )}
        <CardContent>{content}</CardContent>
      </Card>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          void form.handleSubmit(handleSubmitWithValidation as unknown as SubmitHandler<Record<string, unknown>>)(e);
        }}
        className="space-y-4 px-0 w-full"
      >
        <div className="space-y-4">
          {schema.sections.map((section, index) => renderSection(section, index))}
          {error && <div className="text-sm font-medium text-destructive">{error.message}</div>}
        </div>
        {!disabled && renderActions && (
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isLoading}>
                {t("Annuler", "Annuler")}
              </Button>
            )}
            <Button variant="default" type="submit" disabled={isSubmitting || (isLoading ?? false) || form.formState.isSubmitting}>
              {isSubmitting || isLoading ? t("Enregistrement...", "Enregistrement...") : t("Enregistrer", "Enregistrer")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
