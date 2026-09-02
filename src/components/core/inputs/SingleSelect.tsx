import { useKrosoftTranslation } from "@/i18n";
import React, { useMemo, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, ChevronDownIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, controlTriggerClass } from "@/components/ui";
import { cn } from "@/helpers/tailwind.helper";
import type { SelectOption } from "@krosoft/core/types";

export interface SingleSelectOption extends SelectOption {
  /** Texte secondaire affiché en gris à côté du libellé (ex. le groupe d'un tenant). Inclus dans la recherche (mode `searchable`). */
  description?: string;
  /** Option visible mais non sélectionnable : grisée, ignorée par le clic et par la navigation clavier. */
  disabled?: boolean;
}

interface SingleSelectProps {
  options?: SingleSelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  onClear?: () => void;
  /** Active la recherche : rend un panneau filtrable (aligné visuellement sur `MultiSelect`) au lieu du select simple (Radix). */
  searchable?: boolean;
  /** Mode `searchable` : propose de créer une option quand la saisie ne correspond à aucun libellé existant. */
  onCreate?: (label: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  createLabel?: (search: string) => string;
  disabled?: boolean;
  /**
   * Mode `searchable` : panneau rendu en modal (défaut, comme le `Select`). À laisser tel quel dans une boîte de
   * dialogue : sans ça, le `Dialog` neutralise les clics sur le panneau porté dans le portail.
   */
  modal?: boolean;
  className?: string;
}

export const SingleSelect = ({
  options = [],
  value,
  onChange,
  onClear,
  searchable = false,
  onCreate,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  createLabel,
  disabled = false,
  modal = true,
  className,
}: SingleSelectProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasValue = value !== undefined && value !== "";
  const selectedOption = useMemo(() => (hasValue ? options.find(o => o.value === value) : undefined), [hasValue, options, value]);
  const selectedLabel = hasValue ? (selectedOption?.label ?? value) : undefined;

  // --- Mode simple : select Radix (pas de recherche) ---
  if (!searchable) {
    return (
      <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(!hasValue && "text-muted-foreground", className)}
          onClear={
            onClear !== undefined && hasValue && !disabled
              ? e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }
              : undefined
          }
        >
          <SelectValue placeholder={placeholder ?? t("select.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              <span className="flex items-center">
                {option.color !== undefined && <span className="mr-2 size-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />}
                {option.label}
                {option.description !== undefined && <span className="ml-1 text-muted-foreground">({option.description})</span>}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // --- Mode searchable : combobox cmdk (nav clavier ↑/↓ + Entrée) restylé pour matcher MultiSelect ---
  const trimmedSearch = search.trim();
  const canCreate = onCreate !== undefined && trimmedSearch !== "" && !options.some(o => o.label.toLowerCase() === trimmedSearch.toLowerCase());

  const handleOpenChange = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch("");
    }
  };

  const handleSelect = (optionValue: string): void => {
    onChange(optionValue);
    handleOpenChange(false);
  };

  const handleCreate = (): void => {
    onCreate?.(trimmedSearch);
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={modal}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            controlTriggerClass,
            "w-full",
            "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
            !hasValue && "text-muted-foreground",
            className,
          )}
        >
          {/* Marges explicites plutôt qu'un `gap` : `controlTriggerClass` applique `line-clamp-1`
              à ce span, ce qui le passe en `-webkit-box` et neutralise la mise en page flex. */}
          <span className="flex items-center truncate">
            {selectedOption?.color && <span className="mr-2 size-2.5 shrink-0 rounded-full" style={{ backgroundColor: selectedOption.color }} />}
            <span className="truncate">{selectedLabel ?? placeholder ?? t("select.placeholder")}</span>
            {selectedOption?.description !== undefined && <span className="ml-1 truncate text-muted-foreground">({selectedOption.description})</span>}
          </span>
          <div className="flex items-center gap-1">
            {onClear && hasValue && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                }}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </span>
            )}
            <ChevronDownIcon className={cn("size-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        {/* Primitives cmdk (nav clavier) restylées à l'identique de MultiSelect. Le filtrage ne porte
            que sur les mots-clés : la `value` d'un item est son identifiant (souvent un GUID). */}
        <CommandPrimitive
          className="flex flex-col"
          filter={(_, searchValue, keywords) => {
            const haystack = (keywords ?? []).join(" ").toLowerCase();
            return haystack.includes(searchValue.trim().toLowerCase()) ? 1 : 0;
          }}
        >
          <div className="border-b border-border p-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <CommandPrimitive.Input
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder ?? t("search.placeholder")}
                className="w-full rounded-control bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
            </div>
          </div>
          <CommandPrimitive.List className="flex flex-col gap-0.5 max-h-56 overflow-y-auto overflow-x-hidden p-1.5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
            {!canCreate && <CommandPrimitive.Empty className="px-2 py-3 text-center text-xs text-muted-foreground">{emptyLabel ?? t("states.noResult")}</CommandPrimitive.Empty>}
            {/* cmdk pose toujours l'attribut `data-disabled` (`"true"` ou `"false"`) : cibler la valeur,
                sinon le style grisé s'appliquerait à tous les items. */}
            {options.map(option => (
              <CommandPrimitive.Item
                key={option.value}
                value={option.value}
                keywords={[option.label, option.description ?? ""]}
                disabled={option.disabled}
                onSelect={() => {
                  handleSelect(option.value);
                }}
                className="flex min-w-0 items-center gap-2.5 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors data-[selected=true]:bg-muted data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
              >
                <CheckIcon className={cn("size-4 shrink-0", value === option.value ? "opacity-100" : "opacity-0")} />
                {option.color && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />}
                {/* Libellés longs tronqués (ellipsis) plutôt que de forcer un défilement horizontal du panneau. */}
                <span className="min-w-0 flex-1 truncate" title={option.label}>
                  {option.label}
                </span>
                {option.description !== undefined && <span className="shrink-0 truncate text-muted-foreground">({option.description})</span>}
              </CommandPrimitive.Item>
            ))}
            {canCreate && (
              <CommandPrimitive.Item
                forceMount
                value="__create__"
                onSelect={handleCreate}
                className="flex min-w-0 items-center gap-2.5 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors data-[selected=true]:bg-muted"
              >
                <PlusIcon className="size-4 shrink-0" />
                <span className="truncate">{createLabel ? createLabel(trimmedSearch) : t("select.create", { search: trimmedSearch })}</span>
              </CommandPrimitive.Item>
            )}
          </CommandPrimitive.List>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  );
};
