import type { ButtonVariantType } from "./ButtonVariantType";

/** Champs communs à toutes les formes d'action, quelle que soit la façon dont elles sont déclenchées. */
interface AppActionBase {
  icon?: React.ElementType;
  variant?: ButtonVariantType;
  disabled?: boolean;
  className?: string;
}

export type AppAction =
  | (AppActionBase & {
      labelKey: string;
      onClick: () => void | Promise<void>;
      type?: never;
      form?: never;
      children?: never;
    })
  /**
   * Action qui soumet un formulaire rendu ailleurs dans la page (`GenericForm` avec `id`).
   * Le bouton porte `type="submit" form="<id>"` : la soumission passe par le formulaire
   * lui-même — validation comprise — plutôt que par une fonction de submit remontée.
   * Repliée sur `requestSubmit()` dans le menu mobile, où l'action n'est pas un `<button>`.
   */
  | (AppActionBase & {
      labelKey: string;
      onClick?: never;
      type: "submit";
      /** `id` du `<form>` visé. Requis : le menu mobile n'a que lui pour retrouver le formulaire. */
      form: string;
      children?: never;
    })
  | (AppActionBase & {
      labelKey?: string;
      onClick?: never;
      type?: never;
      form?: never;
      children: AppAction[];
    });
