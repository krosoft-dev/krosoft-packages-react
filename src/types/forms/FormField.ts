import { z } from "zod";
import React from "react";
import { FieldType } from "./FieldType";
import type { SelectOption } from "@krosoft/core/types";

export type BaseFormField<T> = {
  key: keyof T;
  labelKey: string;
  type: FieldType;
  placeholderKey?: string;
  defaultValue?: unknown;
  rules?: (_z: typeof z) => z.ZodType;
  layout?: {
    cols?: number;
  };
};

export type HtmlFormField<T> = Omit<BaseFormField<T>, "key" | "labelKey"> & {
  key: "empty";
  type: "html";
  labelKey?: string;
  render: (formValues: T, field: FormField<T>) => React.ReactElement;
};

export type NumberFormField<T> = BaseFormField<T> & {
  type: "number";
  min?: number;
  step?: number;
};

export type ImageFormField<T> = BaseFormField<T> & {
  type: "image";
  accept?: string;
  maxSizeMB?: number;
  hint?: string;
  value?: string | null;
  onChange?: (file: File | null) => void;
};

export type SelectFormField<T> = BaseFormField<T> & {
  type: "select" | "multiSelect";
  options: SelectOption[];
};

export type FormField<T> = ImageFormField<T> | HtmlFormField<T> | NumberFormField<T> | SelectFormField<T> | BaseFormField<T>;
