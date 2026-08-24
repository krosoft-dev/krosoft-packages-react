import { useKrosoftTranslation } from "@/i18n";
import React, { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  controlTriggerClass,
} from "@/components/ui";
import { cn } from "@/helpers/tailwind.helper";
import type { SelectOption } from "@krosoft/core/types";

export interface SearchableSelectOption extends SelectOption {
  /** Texte secondaire affiché en gris à côté du libellé (ex. le groupe d'un tenant). Inclus dans la recherche. */
  description?: string;
}

interface SearchableSelectProps {
  options?: SearchableSelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  onClear?: () => void;
  /** Fourni : propose de créer une option quand la saisie ne correspond à aucun libellé existant. */
  onCreate?: (label: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  createLabel?: (search: string) => string;
  disabled?: boolean;
  /**
   * Panneau rendu en modal (défaut, comme le `Select`). À laisser tel quel dans une boîte de
   * dialogue : sans ça, le `Dialog` neutralise les clics sur le panneau porté dans le portail.
   */
  modal?: boolean;
  className?: string;
}

export const SearchableSelect = ({
  options = [],
  value,
  onChange,
  onClear,
  onCreate,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  createLabel,
  disabled = false,
  modal = true,
  className,
}: SearchableSelectProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasValue = value !== undefined && value !== "";
  const selectedOption = useMemo(() => (hasValue ? options.find(o => o.value === value) : undefined), [hasValue, options, value]);
  const selectedLabel = hasValue ? (selectedOption?.label ?? value) : undefined;

  const trimmedSearch = search.trim();
  const canCreate = onCreate !== undefined && trimmedSearch !== "" && !options.some(o => o.label.toLowerCase() === trimmedSearch.toLowerCase());

  const handleOpenChange = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (!isOpen) setSearch("");
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
        {/* Le filtrage ne porte que sur les mots-clés : la `value` d'un item est son identifiant
            (souvent un GUID), qui produirait des correspondances absurdes. */}
        <Command
          filter={(_, searchValue, keywords) => {
            const haystack = (keywords ?? []).join(" ").toLowerCase();
            return haystack.includes(searchValue.trim().toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder ?? t("search.placeholder")} value={search} onValueChange={setSearch} />
          <CommandList>
            {!canCreate && <CommandEmpty>{emptyLabel ?? t("states.noResult")}</CommandEmpty>}
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label, option.description ?? ""]}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                >
                  <CheckIcon className={cn("mr-2 size-4 shrink-0", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.color !== undefined && <span className="mr-2 size-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />}
                  <span className="truncate">{option.label}</span>
                  {option.description !== undefined && <span className="ml-1 truncate text-muted-foreground">({option.description})</span>}
                </CommandItem>
              ))}
              {canCreate && (
                <CommandItem forceMount value="__create__" onSelect={handleCreate}>
                  <PlusIcon className="mr-2 size-4 shrink-0" />
                  <span className="truncate">{createLabel ? createLabel(trimmedSearch) : t("select.create", { search: trimmedSearch })}</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
