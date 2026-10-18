import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type ConditionFilterOperator, type ConditionFilterValue } from "../../../../src/components/core/filters/ConditionFilter";
import { ConditionFilterGroup } from "../../../../src/components/core/filters/ConditionFilterGroup";

const fields = [
  { value: "export.FilesCount", label: "FilesCount" },
  { value: "export.Folder", label: "Folder" },
];

const operators: ConditionFilterOperator[] = [
  { value: "Equal", label: "=" },
  { value: "GreaterThan", label: ">", numeric: true },
  { value: "NotEmpty", label: "non vide", requiresValue: false },
];

const filesCount: ConditionFilterValue = { field: "export.FilesCount", operator: "GreaterThan", value: "0" };
const folder: ConditionFilterValue = { field: "export.Folder", operator: "Equal", value: "in" };

const renderGroup = (values: ConditionFilterValue[], max?: number): ReturnType<typeof vi.fn> => {
  const onChange = vi.fn();
  render(<ConditionFilterGroup fields={fields} operators={operators} values={values} onChange={onChange} labelKey="Sortie" max={max} />);
  return onChange;
};

afterEach(() => {
  cleanup();
});

describe("ConditionFilterGroup", () => {
  it("affiche une pastille par condition et une pastille d'ajout", () => {
    renderGroup([filesCount, folder]);

    expect(screen.getAllByText(/Sortie :/)).toHaveLength(2);
    expect(screen.getByText("Condition")).toBeTruthy();
  });

  it("sans condition, la pastille d'ajout porte le libellé du groupe", () => {
    renderGroup([]);

    expect(screen.getByText("Sortie")).toBeTruthy();
    expect(screen.queryByText("Condition")).toBeNull();
  });

  it("masque la pastille d'ajout une fois le maximum atteint", () => {
    renderGroup([filesCount, folder], 2);

    expect(screen.queryByText("Condition")).toBeNull();
  });

  it("retirer une pastille retire sa condition", () => {
    const onChange = renderGroup([filesCount, folder]);

    fireEvent.pointerDown(screen.getAllByLabelText("Retirer le filtre")[0]);

    expect(onChange).toHaveBeenCalledWith([folder]);
  });
});
