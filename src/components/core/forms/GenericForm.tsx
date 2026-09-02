import { useKrosoftTranslation } from "@/i18n";
import { ImageInput } from "@/components/core/inputs/ImageInput";
import { AppSubTitle } from "@/components/core/layouts/AppSubTitle";
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
import React, { useEffect, useRef, useState } from "react";
import { useForm, ControllerRenderProps, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/ui/useToast";

/**
 * Props mapping for the GenericForm component.
 */
interface GenericFormProps<T> {
  /**
   * The structural schema definition containing sections and form fields.
   * If null or undefined, the form renders nothing.
   */
  schema: FormSchema<T> | null | undefined;
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
   * Identifiant posé sur le `<form>`. Permet à un bouton rendu hors du formulaire
   * (pied d'une dialog, barre d'actions) de le soumettre via `form="<id>"`.
   */
  id?: string;
  /**
   * The default column span (1 to 4) for fields that do not explicitly declare a layout.cols property.
   * Defaults to 4 (full width).
   */
  defaultCols?: 1 | 2 | 3 | 4;
}

/**
 * Builds the Zod validation schema from the field rules declared in the form schema.
 * Tolerates a missing schema so it can be called before the schema is loaded.
 */
const buildZodSchema = <T,>(schema: FormSchema<T> | null | undefined): z.ZodObject<Record<string, z.ZodType>> => {
  const schemaFields: Record<string, z.ZodType> = {};

  (schema?.sections ?? []).forEach(section => {
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

/**
 * Initial form values: the provided data when available, otherwise the default value of each field.
 */
const buildDefaultValues = <T,>(schema: FormSchema<T> | null | undefined, initialData?: T): Record<string, unknown> =>
  (initialData as unknown as Record<string, unknown>) ||
  Object.fromEntries((schema?.sections ?? []).flatMap(section => section.fields.map(field => [field.key, field.defaultValue ?? null])));

/**
 * Image previews already available in the initial data, keyed by field.
 */
const buildImagePreviews = <T,>(schema: FormSchema<T> | null | undefined, initialData?: T): Record<string, string> => {
  const previews: Record<string, string> = {};
  if (!initialData) return previews;

  (schema?.sections ?? []).forEach(section => {
    section.fields.forEach(field => {
      const value = initialData[field.key as keyof T];
      if (field.type === "image" && typeof value === "string" && value) {
        previews[field.key as string] = value;
      }
    });
  });

  return previews;
};

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
  id,
  defaultCols = 4,
}: GenericFormProps<T>): React.ReactElement | null => {
  const { t } = useKrosoftTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<Record<string, string>>(() => buildImagePreviews(schema, initialData));

  const form = useForm({
    resolver: zodResolver(buildZodSchema(schema)),
    defaultValues: buildDefaultValues(schema, initialData),
  });

  // Le schéma peut être chargé de façon asynchrone : les valeurs par défaut et les aperçus calculés
  // au montage sont alors vides, il faut les réinjecter dès que le schéma devient disponible.
  const isSchemaInitialized = useRef(!!schema);
  useEffect(() => {
    if (!schema || isSchemaInitialized.current) return;
    isSchemaInitialized.current = true;
    form.reset(buildDefaultValues(schema, initialData));
    setImagePreview(buildImagePreviews(schema, initialData));
  }, [form, schema, initialData]);

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

  const handleSubmitWithValidation = async (data: T): Promise<void> => {
    if (isSubmitting) return;

    const hasErrors = Object.keys(form.formState.errors).length > 0;
    if (hasErrors) {
      toast({
        title: t("form.validationTitle"),
        description: t("form.validationMessage"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(data));
    } catch (err) {
      console.error("Error during form submission:", err);
      toast({
        title: t("states.errorTitle"),
        description: t("form.submitError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePreview = (fieldKey: string, url: string): void => {
    setImagePreview(prev => ({ ...prev, [fieldKey]: url }));
  };

  const hasNullableRule = (rules?: (_z: typeof z) => z.ZodType): boolean => {
    if (!rules) return false;
    const walk = (ruleSchema: unknown): boolean => {
      if (!ruleSchema || !(ruleSchema as { _def?: unknown })._def) return false;
      const def = (ruleSchema as { _def: { typeName?: string; innerType?: unknown; type?: unknown } })._def;
      if (def.typeName === "ZodNullable") return true;
      if (def.innerType) return walk(def.innerType);
      if (def.type) return walk(def.type);
      return false;
    };
    try {
      const ruleSchema = rules(z);
      return walk(ruleSchema);
    } catch {
      return false;
    }
  };

  const hasMinRule = (rules?: (_z: typeof z) => z.ZodType): boolean => {
    if (!rules) return false;
    const rulesSchema = rules(z);
    if (rulesSchema.safeParse(undefined).success) return false;
    const def = (rulesSchema as unknown as { _def: { checks?: { kind: string }[] } })._def;
    return def.checks?.some(check => check.kind === "min") ?? false;
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
        const fieldKey = field.key as string;
        const formValue = typeof formField.value === "string" ? formField.value : undefined;
        // Champ contrôlé : la prop fait foi. Sinon on affiche l'URL portée par le formulaire, ou
        // l'aperçu local du fichier tout juste sélectionné (formField.value contient alors un File).
        const imageValue = imageField.value !== undefined ? imageField.value : (formValue ?? imagePreview[fieldKey]);
        return (
          <ImageInput
            value={imageValue ?? ""}
            onChange={file => {
              if (imageField.onChange) imageField.onChange(file);
              formField.onChange(file);
              // Update image preview
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleImagePreview(fieldKey, reader.result as string);
                };
                reader.readAsDataURL(file);
              } else {
                handleImagePreview(fieldKey, "");
              }
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
        const isNullable = hasNullableRule(field.rules);
        const currentValue = formField.value === null || formField.value === undefined ? "" : (formField.value as string);
        const selectOptions = selectField.options as { value: string; label: string; color?: string }[];
        const selectedOption = selectOptions.find(opt => opt.value === currentValue);

        return (
          <Select value={currentValue} onValueChange={formField.onChange} disabled={isFieldDisabled}>
            <FormControl>
              <SelectTrigger
                className={cn(hasError && "border-destructive")}
                onClear={
                  isNullable && currentValue
                    ? e => {
                        e.preventDefault();
                        e.stopPropagation();
                        formField.onChange(null);
                      }
                    : undefined
                }
              >
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
        return htmlField.render(form.getValues() as T, field);
      }
      default:
        return null;
    }
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

    if (schema?.useCards === false) {
      return (
        <div key={index} className="space-y-4 mb-6">
          {section.titleKey && <AppSubTitle titleKey={section.titleKey} />}
          {content}
        </div>
      );
    }

    return (
      <Card key={index} className="mb-6">
        {section.titleKey && (
          <CardHeader>
            <AppSubTitle titleKey={section.titleKey} />
          </CardHeader>
        )}
        <CardContent>{content}</CardContent>
      </Card>
    );
  };

  if (!schema) return null;

  return (
    <Form {...form}>
      <form
        id={id}
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
                {t("actions.cancel")}
              </Button>
            )}
            <Button variant="default" type="submit" disabled={isSubmitting || (isLoading ?? false) || form.formState.isSubmitting}>
              {isSubmitting || isLoading ? t("actions.saving") : t("actions.save")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
