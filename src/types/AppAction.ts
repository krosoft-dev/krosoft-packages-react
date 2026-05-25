import { ButtonVariantType } from "./ButtonVariantType";

export type AppAction =
  | {
      icon?: React.ElementType;
      labelKey: string;
      variant?: ButtonVariantType;
      onClick: () => void | Promise<void>;
      disabled?: boolean;
      children?: never;
      className?: string;
    }
  | {
      icon?: React.ElementType;
      labelKey?: string;
      variant?: ButtonVariantType;
      onClick: never;
      disabled?: boolean;
      children: AppAction[];
      className?: string;
    };
