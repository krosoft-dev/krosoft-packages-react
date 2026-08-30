import { cn } from "@/helpers/tailwind.helper";

export interface FilterPillOption<T extends string | number> {
  value: T;
  label: string;
  count?: number;
  /** Icône affichée devant le libellé. */
  icon?: React.ElementType;
  /** Style coloré de la pastille (bordure/fond/texte) ; remplace le style par défaut, l'état actif étant marqué en gras. */
  className?: string;
}

export type FilterPillsVariant = "solid" | "outline";

export interface FilterPillsGroupProps<T extends string | number> {
  options: FilterPillOption<T>[];
  /** Valeurs actives ; plusieurs pastilles peuvent l'être à la fois. */
  values: T[];
  /** `NoInfer` : `T` est déduit de `options`/`values` seulement, pour accepter un setter `useState` directement. */
  onToggle: (value: NoInfer<T>) => void;
  /** Style des options actives : fond plein (`solid`, défaut) ou bordure/texte `primary` (`outline`). */
  variant?: FilterPillsVariant;
}

const activeStylesByVariant: Record<FilterPillsVariant, string> = {
  solid: "border-foreground bg-foreground text-background",
  outline: "border-primary bg-primary/10 text-primary font-medium",
};

function getPillStyles(isActive: boolean, variant: FilterPillsVariant, className?: string): string {
  if (className !== undefined) {
    return cn(className, isActive ? "font-semibold" : "opacity-60 hover:opacity-100");
  }
  return isActive
    ? activeStylesByVariant[variant]
    : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40";
}

/**
 * Groupe de pastilles de filtre à sélection multiple, avec compteur optionnel par option.
 *
 * Version multi-sélection de `FilterPills` (qui en est le cas particulier à sélection
 * unique) : chaque clic bascule la valeur via `onToggle`.
 */
export function FilterPillsGroup<T extends string | number>({ options, values, onToggle, variant = "solid" }: FilterPillsGroupProps<T>): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ value: optionValue, label, count, icon: Icon, className }) => {
        const isActive = values.includes(optionValue);
        const styles = getPillStyles(isActive, variant, className);
        return (
          <button
            key={String(optionValue)}
            onClick={() => {
              onToggle(optionValue);
            }}
            className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-control border transition-colors", styles)}
          >
            {Icon && <Icon className="size-3 shrink-0" />}
            {label} {count !== undefined && <span className="opacity-60">({count})</span>}
          </button>
        );
      })}
    </div>
  );
}
