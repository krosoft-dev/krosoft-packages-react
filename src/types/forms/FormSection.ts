import { FormField } from "./FormField";
import React from "react";

export interface FormSection<T> {
  titleKey?: string;
  title?: string;
  icon?: React.ReactNode;
  fields: FormField<T>[];
  layout?: {
    cols?: number;
  };
}
