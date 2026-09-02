import { useKrosoftTranslation } from "@/i18n";
import React, { useState, useMemo } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Checkbox, controlBaseClass, controlFilterWidthClass, controlTriggerClass, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";
import type { SelectOption } from "@krosoft/core/types";

export interface MultiSelectOption extends SelectOption {
  /** Option visible mais non basculable : grisée, ignorée par le clic, la navigation clavier et les actions globales. */
  disabled?: boolean;
}

/**
 * Les props non reconnues (et la `ref`) sont relayées au bouton du trigger : c'est ce qui permet à un
 * `<FormControl>` (Slot) d'y poser `id`, `aria-describedby` et `aria-invalid`, et donc de raccrocher le
 * champ à son libellé et à son message d'erreur. Sous React 19 `ref` est une prop ordinaire, elle voyage
 * donc dans le spread : pas de `forwardRef`, qui effacerait en plus le générique `T` (voir aussi `SingleSelect`).
 */
interface MultiSelectProps<T extends string = string> extends Omit<React.ComponentProps<"button">, "children" | "disabled" | "onChange" | "onToggle" | "value"> {
  options: MultiSelectOption[];
  selected: T[];
  onToggle: (val: T) => void;
  onClear?: () => void;
  onSelectAll?: (values: T[]) => void;
  /**
   * `"input"` : contrôle de formulaire pleine largeur (libellés sélectionnés + compteur `+N`).
   * `"filter"` : le même contrôle, mais dimensionné pour une barre de filtres
   * (`controlFilterWidthClass`) plutôt que pour la largeur d'un champ de formulaire.
   * `"pill"` : pastille de filtre compacte (libellé i18n fixe + badge du nombre de sélections).
   */
  variant?: "input" | "filter" | "pill";
  placeholder?: string;
  /** Libellé i18n fixe de la pastille (variant `"pill"`). */
  labelKey?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  /** Nombre de libellés affichés dans le trigger (variant `"input"`), le reste est résumé par un compteur `+N`. */
  maxCount?: number;
  className?: string;
}

export const MultiSelect = <T extends string = string>({
  options,
  selected,
  onToggle,
  onClear,
  onSelectAll,
  variant = "input",
  placeholder,
  labelKey,
  searchable = false,
  searchPlaceholder,
  disabled = false,
  maxCount,
  className,
  ...triggerProps
}: MultiSelectProps<T>): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isPill = variant === "pill";
  // `pill` et `filter` vivent tous deux dans une barre de filtres : même largeur par défaut,
  // seule l'apparence du trigger les sépare.
  const filterWidth = variant === "input" ? undefined : controlFilterWidthClass;

  const filteredOptions = useMemo(() => {
    if (query === "") {
      return options;
    }
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  // Une option désactivée n'est jamais basculée par l'utilisateur : ni au clic, ni au clavier, ni par
  // les actions globales ("Tout sélectionner", croix du trigger). Elle reste donc hors de tous les calculs.
  const selectableValues = useMemo(() => filteredOptions.filter(o => o.disabled !== true).map(o => o.value as T), [filteredOptions]);
  const lockedSelected = useMemo(() => selected.filter(s => options.find(o => o.value === s)?.disabled === true), [options, selected]);

  const isAllSelected = useMemo(() => {
    if (selectableValues.length === 0) {
      return false;
    }
    return selectableValues.every(value => selected.includes(value));
  }, [selectableValues, selected]);

  // Au-delà de `maxCount`, les libellés restants sont résumés par un compteur gardé hors
  // de la zone tronquée : sinon des libellés longs mangent tout le trigger et on ne voit
  // plus combien de valeurs sont réellement sélectionnées.
  const selectedLabels = useMemo(() => selected.map(s => options.find(o => o.value === s)?.label ?? s), [options, selected]);
  const visibleLabels = maxCount !== undefined && maxCount > 0 ? selectedLabels.slice(0, maxCount) : selectedLabels;
  const hiddenCount = selectedLabels.length - visibleLabels.length;

  const handleOpenChange = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  };

  // Vide la sélection en respectant l'API disponible : `onClear` si fourni, sinon `onSelectAll([])`,
  // sinon on bascule chaque valeur sélectionnée. Dès qu'une option désactivée est sélectionnée, ce
  // vidage global lui passerait dessus : on retombe alors sur les seules API capables de la préserver.
  const clearAll = (): void => {
    if (lockedSelected.length > 0) {
      if (onSelectAll !== undefined) {
        onSelectAll(lockedSelected);
      } else {
        selected
          .filter(s => !lockedSelected.includes(s))
          .forEach(s => {
            onToggle(s);
          });
      }
    } else if (onClear !== undefined) {
      onClear();
    } else if (onSelectAll !== undefined) {
      onSelectAll([] as T[]);
    } else {
      selected.forEach(s => {
        onToggle(s);
      });
    }
  };

  const handleToggleAll = (): void => {
    if (isAllSelected) {
      // Désélectionner les options visibles (filtrées) et basculables
      if (onSelectAll !== undefined) {
        const remaining = selected.filter(s => !selectableValues.includes(s));
        onSelectAll(remaining);
      } else if (onClear !== undefined && selected.every(s => selectableValues.includes(s))) {
        // `onClear` vide tout : réservé au cas où la sélection ne déborde pas des options visibles et basculables.
        onClear();
      } else {
        selectableValues.forEach(value => {
          onToggle(value);
        });
      }
    } else if (onSelectAll !== undefined) {
      const newSelected = [...selected];
      selectableValues.forEach(value => {
        if (!newSelected.includes(value)) {
          newSelected.push(value);
        }
      });
      onSelectAll(newSelected);
    } else {
      selectableValues.forEach(value => {
        if (!selected.includes(value)) {
          onToggle(value);
        }
      });
    }
  };

  const trigger = isPill ? (
    <button
      {...triggerProps}
      type="button"
      disabled={disabled}
      className={cn(
        controlBaseClass,
        "inline-flex items-center justify-between gap-1.5 whitespace-nowrap transition-colors",
        selected.length > 0 ? "border-primary bg-primary/10 text-primary font-medium" : "hover:bg-muted",
        filterWidth,
        className,
      )}
    >
      <span className="truncate">{labelKey !== undefined ? t(labelKey) : (placeholder ?? t("select.placeholder"))}</span>
      <div className="flex shrink-0 items-center gap-1.5">
        {selected.length > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {selected.length}
          </span>
        )}
        <ChevronDownIcon className={cn("size-3.5 opacity-60 transition-transform", open && "rotate-180")} />
      </div>
    </button>
  ) : (
    <button
      {...triggerProps}
      type="button"
      disabled={disabled}
      className={cn(
        controlTriggerClass,
        "w-full",
        filterWidth,
        open && "ring-2 ring-ring ring-offset-2",
        selected.length === 0 && "text-muted-foreground",
        className,
      )}
    >
      <span className="truncate">{selected.length === 0 ? (placeholder ?? t("select.placeholder")) : visibleLabels.join(", ")}</span>
      <div className="flex shrink-0 items-center gap-1">
        {hiddenCount > 0 && <span className="rounded-control bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">+{hiddenCount}</span>}
        {selected.length > 0 && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            onClick={e => {
              e.stopPropagation();
            }}
            onPointerDown={e => {
              e.preventDefault();
              e.stopPropagation();
              clearAll();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </span>
        )}
        <ChevronDownIcon className={cn("size-4 opacity-50 shrink-0 transition-transform", open && "rotate-180")} />
      </div>
    </button>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={cn("p-0", isPill ? "w-72 max-w-[var(--radix-popover-content-available-width)]" : "w-[var(--radix-popover-trigger-width)]")} align="start">
        {/* cmdk pilote la nav clavier (↑/↓ + Entrée pour cocher). `shouldFilter={false}` : on garde
            notre filtrage manuel (`filteredOptions`), indispensable au "Tout sélectionner" qui ne
            porte que sur les options visibles. */}
        <CommandPrimitive shouldFilter={false} className="flex flex-col">
          {searchable ? (
            <div className="border-b border-border p-2">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <CommandPrimitive.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={searchPlaceholder ?? t("search.placeholder")}
                  className="w-full rounded-control bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            // Sans recherche visible, un input caché sert d'ancre de focus pour que cmdk capte les flèches.
            <CommandPrimitive.Input autoFocus tabIndex={-1} className="sr-only" />
          )}
          <CommandPrimitive.List className="flex flex-col gap-0.5 max-h-56 overflow-y-auto overflow-x-hidden p-1.5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
            {filteredOptions.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">{t("states.noResult")}</p>}
            {/* cmdk pose toujours l'attribut `data-disabled` (`"true"` ou `"false"`) : cibler la valeur,
                sinon le style grisé s'appliquerait à tous les items. */}
            {filteredOptions.map(opt => (
              <CommandPrimitive.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                onSelect={() => {
                  onToggle(opt.value as T);
                }}
                className="flex min-w-0 items-center gap-2.5 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors data-[selected=true]:bg-muted data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
              >
                {/* Case présentational : c'est l'item cmdk (clic/Entrée) qui bascule, pas la case elle-même. */}
                <span className="pointer-events-none shrink-0">
                  <Checkbox checked={selected.includes(opt.value as T)} />
                </span>
                {opt.color && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: opt.color }} />}
                {/* Libellés longs tronqués (ellipsis) plutôt que de forcer un défilement horizontal du panneau. */}
                <span className="min-w-0 flex-1 truncate" title={opt.label}>
                  {opt.label}
                </span>
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>
        </CommandPrimitive>
        {/* Masqué quand plus rien n'est basculable : le bouton serait sans effet. */}
        {selectableValues.length > 0 && (
          <div className="border-t border-border p-1.5">
            <button
              type="button"
              onClick={handleToggleAll}
              className="w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
            >
              {isAllSelected ? t("filters.deselectAll") : t("filters.selectAll")}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
