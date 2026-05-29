import { FormSection } from "./FormSection";

export interface FormSchema<T> {
  sections: FormSection<T>[];
  useCards?: boolean;
}
