import { useKrosoftTranslation } from "@/i18n";
import React, { useState } from "react";
import { Button, controlBaseClass, controlFilterWidthClass, Input, Label, Popover, PopoverContent, PopoverTrigger, ToggleGroup, ToggleGroupItem } from "@/components/ui";
import { ChevronDownIcon, type LucideIcon, XIcon } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";
import { SingleSelect, type SingleSelectOption } from "../inputs/SingleSelect";

/** Champ sur lequel porte la condition (ex. une propriété de sortie). `description` précise sa provenance. */
export type ConditionFilterField = SingleSelectOption;

export interface ConditionFilterOperator {
  value: string;
  /** Libellé court affiché dans le bouton et le résumé (ex. `≥`). */
  label: string;
  /** Libellé long en infobulle (ex. « supérieur ou égal »). */
  title?: string;
  /** `false` pour un opérateur sans valeur (ex. « non vide »). Défaut : `true`. */
  requiresValue?: boolean;
  /** La valeur doit être un nombre (ex. `>`, `≤`). */
  numeric?: boolean;
}

export interface ConditionFilterValue {
  field: string;
  operator: string;
  /** Vide pour un opérateur sans valeur. */
  value: string;
}

export interface ConditionFilterProps {
  fields: ConditionFilterField[];
  operators: ConditionFilterOperator[];
  /** Condition appliquée ; `undefined` = pas de filtre. */
  value: ConditionFilterValue | undefined;
  /** Appelé à l'application (bouton ou Entrée) et à l'effacement (`undefined`). */
  onChange: (value: ConditionFilterValue | undefined) => void;
  /** Libellé i18n de la pastille (ex. « Sortie »). */
  labelKey?: string;
  /** Icône facultative devant le libellé de la pastille. Aucune par défaut, comme les autres pastilles de filtre. */
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

interface Draft {
  field?: string;
  operator?: string;
  value: string;
}

const requiresValue = (operator?: ConditionFilterOperator): boolean => operator?.requiresValue !== false;

/**
 * Filtre « champ / opérateur / valeur » regroupé dans une seule pastille.
 *
 * La pastille résume la condition appliquée (`Sortie : FilesCount ≥ 2`) ; un clic ouvre un panneau
 * où l'on choisit le champ, l'opérateur et la valeur. La condition n'est transmise qu'une fois
 * complète et validée (bouton « Appliquer » ou Entrée) : pas de requête à chaque frappe ni de
 * filtre à moitié saisi.
 */
export function ConditionFilter({ fields, operators, value, onChange, labelKey, icon: Icon, disabled = false, className }: ConditionFilterProps): React.ReactElement {
  const { t } = useKrosoftTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ value: "" });

  const appliedField = value !== undefined ? fields.find(f => f.value === value.field) : undefined;
  const appliedOperator = value !== undefined ? operators.find(o => o.value === value.operator) : undefined;
  const isApplied = value !== undefined;

  const draftOperator = operators.find(o => o.value === draft.operator);
  const draftNeedsValue = requiresValue(draftOperator);
  const isNumeric = draftOperator?.numeric === true;
  const draftValue = draft.value.trim();
  // Garde-fou : le champ est en type="number" pour un opérateur numérique, mais une valeur saisie
  // avant le changement d'opérateur peut encore être du texte.
  const isNumberInvalid = draftNeedsValue && isNumeric && draftValue !== "" && Number.isNaN(Number(draftValue));
  const canApply = draft.field !== undefined && draftOperator !== undefined && (!draftNeedsValue || draftValue !== "") && !isNumberInvalid;

  const handleOpenChange = (isOpen: boolean): void => {
    // Le panneau repart de la condition appliquée : une saisie abandonnée n'est pas conservée.
    if (isOpen) {
      setDraft(value !== undefined ? { ...value } : { value: "" });
    }
    setOpen(isOpen);
  };

  const apply = (): void => {
    if (!canApply || draft.field === undefined || draftOperator === undefined) {
      return;
    }
    onChange({ field: draft.field, operator: draftOperator.value, value: draftNeedsValue ? draftValue : "" });
    setOpen(false);
  };

  const clear = (): void => {
    onChange(undefined);
    setOpen(false);
  };

  const label = labelKey !== undefined ? t(labelKey) : t("filters.condition.label");

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            controlBaseClass,
            "inline-flex items-center justify-between gap-1.5 whitespace-nowrap transition-colors",
            isApplied ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted",
            !isApplied && controlFilterWidthClass,
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {Icon !== undefined && <Icon className="size-3.5 shrink-0 opacity-70" />}
            <span className="truncate">
              {value !== undefined ? (
                <>
                  {label} :{" "}
                  <span className="font-semibold">{appliedField?.label ?? value.field}</span> {appliedOperator?.label ?? value.operator}
                  {value.value !== "" && <span className="font-semibold"> {value.value}</span>}
                </>
              ) : (
                label
              )}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {isApplied && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label={t("filters.condition.clear")}
                onClick={e => {
                  e.stopPropagation();
                }}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(undefined);
                }}
                className="opacity-70 hover:opacity-100"
              >
                <XIcon className="size-3.5" />
              </span>
            )}
            <ChevronDownIcon className={cn("size-3.5 opacity-60 transition-transform", open && "rotate-180")} />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-4">
        <div className="space-y-1.5">
          <Label>{t("filters.condition.field")}</Label>
          <SingleSelect
            options={fields}
            value={draft.field}
            onChange={field => {
              setDraft(d => ({ ...d, field }));
            }}
            placeholder={t("filters.condition.selectField")}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("filters.condition.operator")}</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            className="flex-wrap justify-start"
            value={draft.operator ?? ""}
            onValueChange={operator => {
              setDraft(d => {
                const next = operators.find(o => o.value === operator);
                // Une valeur texte n'a pas de sens pour un opérateur numérique : on la vide plutôt que de la laisser invalide.
                const keepValue = next?.numeric !== true || !Number.isNaN(Number(d.value.trim()));
                return { ...d, operator: operator === "" ? undefined : operator, value: keepValue ? d.value : "" };
              });
            }}
          >
            {operators.map(operator => (
              <ToggleGroupItem key={operator.value} value={operator.value} title={operator.title} aria-label={operator.title ?? operator.label} className="min-w-9 px-2">
                {operator.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {draftNeedsValue && (
          <div className="space-y-1.5">
            <Label htmlFor="condition-filter-value">{t("filters.condition.value")}</Label>
            <Input
              id="condition-filter-value"
              value={draft.value}
              type={isNumeric ? "number" : "text"}
              step="any"
              onChange={e => {
                setDraft(d => ({ ...d, value: e.target.value }));
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  apply();
                }
              }}
            />          </div>
        )}

        <div className="flex justify-end gap-2">
          {isApplied && (
            <Button variant="ghost" size="sm" onClick={clear}>
              {t("filters.condition.clear")}
            </Button>
          )}
          <Button size="sm" onClick={apply} disabled={!canApply}>
            {t("filters.condition.apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
