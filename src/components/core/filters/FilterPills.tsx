import { FilterPillsGroup, type FilterPillOption, type FilterPillsVariant } from "./FilterPillsGroup";

export interface FilterPillsProps<T extends string | number> {
  options: FilterPillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Style de l'option active : fond plein (`solid`, défaut) ou bordure/texte `primary` (`outline`). */
  variant?: FilterPillsVariant;
}

/**
 * Groupe de pastilles de filtre à sélection unique, avec compteur optionnel par option.
 *
 * Complémentaire de `SearchableFilterPill` (multi-sélection en popover) : ici toutes les
 * options sont visibles en ligne et une seule est active à la fois, comme un segmented control.
 * Pour la multi-sélection inline, voir `FilterPillsGroup`.
 */
export function FilterPills<T extends string | number>({ options, value, onChange, variant = "solid" }: FilterPillsProps<T>): React.ReactElement {
  return <FilterPillsGroup options={options} values={[value]} onToggle={onChange} variant={variant} />;
}
