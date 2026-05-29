import { FormField } from "./FormField";
import React from "react";

export interface FormSection<T> {
  titleKey?: string;
  icon?: React.ElementType;
  iconClassName?: string;
  fields: FormField<T>[];
  layout?: {
    cols?: number;
  };
}
