import React, { useRef } from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";
import { ConditionFilter, type ConditionFilterField, type ConditionFilterOperator, type ConditionFilterValue } from "./ConditionFilter";

export interface ConditionFilterGroupProps {
  fields: ConditionFilterField[];
  operators: ConditionFilterOperator[];
  /** Conditions appliquées, combinées en ET. */
  values: ConditionFilterValue[];
  /** Appelé avec la nouvelle liste à chaque ajout, modification ou retrait d'une condition. */
  onChange: (values: ConditionFilterValue[]) => void;
  /** Libellé i18n des pastilles (ex. « Sortie »). */
  labelKey?: string;
  /** Nombre maximal de conditions. Défaut : 5. */
  max?: number;
  disabled?: boolean;
  className?: string;
}

const isSameCondition = (a: ConditionFilterValue, b: ConditionFilterValue): boolean => a.field === b.field && a.operator === b.operator && a.value === b.value;

/**
 * Liste de conditions « champ / opérateur / valeur » combinées en ET : une pastille {@link ConditionFilter}
 * par condition appliquée, plus une pastille d'ajout (« + Condition »).
 *
 * La pastille d'ajout ouvre un panneau vide : la condition n'est ajoutée qu'une fois appliquée, une saisie
 * abandonnée ne laisse rien. Retirer une pastille retire sa condition. Une condition identique à une
 * condition déjà appliquée n'est pas ajoutée une seconde fois.
 */
export function ConditionFilterGroup({
  fields,
  operators,
  values,
  onChange,
  labelKey,
  max = 5,
  disabled = false,
  className,
}: ConditionFilterGroupProps): React.ReactElement {
  // La croix d'une pastille retire sa condition dès le `pointerdown` : les pastilles suivantes se décalent
  // sous le curseur et le `click` qui suit ouvrirait le panneau de l'une d'elles. On l'absorbe.
  const isRemovingRef = useRef(false);

  const add = (value: ConditionFilterValue | undefined): void => {
    if (value === undefined || values.some(v => isSameCondition(v, value))) {
      return;
    }
    onChange([...values, value]);
  };

  const replace = (index: number, value: ConditionFilterValue | undefined): void => {
    if (value === undefined) {
      isRemovingRef.current = true;
      onChange(values.filter((_, i) => i !== index));
      return;
    }
    onChange(values.map((v, i) => (i === index ? value : v)));
  };

  const isEmpty = values.length === 0;

  const resetRemoving = (): void => {
    isRemovingRef.current = false;
  };
  const swallowClickAfterRemove = (e: React.MouseEvent): void => {
    if (isRemovingRef.current) {
      isRemovingRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      onPointerDownCapture={resetRemoving}
      onKeyDownCapture={resetRemoving}
      onClickCapture={swallowClickAfterRemove}
    >
      {values.map((value, index) => (
        <ConditionFilter
          // Les conditions n'ont pas d'identifiant : l'index suffit, chaque pastille relit sa condition à l'ouverture.
          key={index}
          fields={fields}
          operators={operators}
          value={value}
          onChange={next => {
            replace(index, next);
          }}
          labelKey={labelKey}
          disabled={disabled}
        />
      ))}
      {values.length < max && (
        // Sans condition, la pastille d'ajout porte le libellé du groupe, comme une pastille de filtre ordinaire.
        <ConditionFilter
          fields={fields}
          operators={operators}
          value={undefined}
          onChange={add}
          labelKey={isEmpty ? labelKey : "filters.condition.add"}
          icon={isEmpty ? undefined : PlusIcon}
          disabled={disabled}
        />
      )}
    </div>
  );
}
