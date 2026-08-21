import { cleanup, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "../../../../src/components/core/table/DataTable";
import { ACTIONS_COLUMN_KEY, SELECTION_COLUMN_KEY } from "../../../../src/components/core/table/fixedColumns";
import type { ColumnDef } from "../../../../src/types/ColumnDef";

type Row = { id: string; name: string; email: string; role: string };

const rows: Row[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
];

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", fixed: "left" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", fixed: "right" },
];

const renderTable = (props: Partial<React.ComponentProps<typeof DataTable<Row>>> = {}): HTMLElement => {
  const { container } = render(<DataTable data={rows} columns={columns} getRowId={(row: Row) => row.id} {...props} />);
  return container;
};

const headerCell = (container: HTMLElement, key: string): HTMLTableCellElement => {
  const cell = container.querySelector<HTMLTableCellElement>(`thead th[data-column-key="${key}"]`);
  if (cell === null) throw new Error(`En-tête introuvable pour la colonne ${key}`);
  return cell;
};

const bodyCells = (container: HTMLElement, key: string): HTMLTableCellElement[] => {
  const index = Array.from(container.querySelectorAll("thead th")).findIndex(cell => cell.getAttribute("data-column-key") === key);
  return Array.from(container.querySelectorAll<HTMLTableRowElement>("tbody tr")).map(row => row.cells[index]);
};

// jsdom ne fait pas de mise en page : sans largeurs simulées, toutes les colonnes mesurent 0.
const stubColumnWidths = (widths: Record<string, number>): void => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const key = this.getAttribute("data-column-key") ?? "";
    return { width: widths[key] ?? 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) };
  });
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DataTable — colonnes figées", () => {
  it("accroche l'en-tête au même bord et au même décalage que ses cellules", () => {
    const container = renderTable();

    for (const [key, side] of [
      ["name", "left"],
      ["role", "right"],
    ] as const) {
      const header = headerCell(container, key);
      expect(header.className).toContain("sticky");
      expect(header.style[side]).not.toBe("");

      for (const cell of bodyCells(container, key)) {
        expect(cell.className).toContain("sticky");
        expect(cell.style[side]).toBe(header.style[side]);
      }
    }
  });

  it("laisse dans le flux les colonnes qui ne sont pas figées", () => {
    const container = renderTable();

    const header = headerCell(container, "email");
    expect(header.className).not.toContain("sticky");
    expect(header.getAttribute("data-fixed-side")).toBeNull();
    expect(bodyCells(container, "email").every(cell => !cell.className.includes("sticky"))).toBe(true);
  });

  it("ne laisse pas déplacer une colonne figée au glisser-déposer", () => {
    const container = renderTable({ draggableColumns: true });

    expect(headerCell(container, "name").draggable).toBe(false);
    expect(headerCell(container, "email").draggable).toBe(true);
  });

  it("fige l'en-tête de la colonne des actions avec ses cellules quand fixedActions est actif", () => {
    const container = renderTable({
      fixedActions: true,
      actions: [{ label: "Modifier", onClick: () => undefined }],
    });

    const header = headerCell(container, ACTIONS_COLUMN_KEY);
    expect(header.getAttribute("data-fixed-side")).toBe("right");
    expect(header.className).toContain("sticky");
    expect(bodyCells(container, ACTIONS_COLUMN_KEY).every(cell => cell.className.includes("sticky"))).toBe(true);
  });

  it("fige la case de sélection avec la première colonne figée à gauche", () => {
    const container = renderTable({
      bulkActions: [{ label: "Supprimer", onClick: () => undefined }],
    });

    const header = headerCell(container, SELECTION_COLUMN_KEY);
    expect(header.getAttribute("data-fixed-side")).toBe("left");
    expect(header.className).toContain("sticky");
    expect(bodyCells(container, SELECTION_COLUMN_KEY).every(cell => cell.className.includes("sticky"))).toBe(true);
  });

  it("empile les colonnes figées du même bord au lieu de les superposer", () => {
    stubColumnWidths({ name: 150, email: 200, role: 100, [ACTIONS_COLUMN_KEY]: 40 });

    const container = renderTable({
      columns: [
        { key: "name", label: "Name", fixed: "left" },
        { key: "email", label: "Email", fixed: "left" },
        { key: "role", label: "Role", fixed: "right" },
      ],
      fixedActions: true,
      actions: [{ label: "Modifier", onClick: () => undefined }],
    });

    // À gauche, la deuxième colonne figée démarre après la largeur de la première.
    expect(headerCell(container, "name").style.left).toBe("0px");
    expect(headerCell(container, "email").style.left).toBe("150px");
    // À droite, l'empilement part du bord opposé : les actions collent au bord, Role vient devant.
    expect(headerCell(container, ACTIONS_COLUMN_KEY).style.right).toBe("0px");
    expect(headerCell(container, "role").style.right).toBe("40px");
    // Chaque cellule reprend le décalage de son en-tête.
    expect(bodyCells(container, "email").every(cell => cell.style.left === "150px")).toBe(true);
    expect(bodyCells(container, "role").every(cell => cell.style.right === "40px")).toBe(true);
  });

  it("laisse la case de sélection dans le flux quand aucune colonne n'est figée à gauche", () => {
    const { container } = render(
      <DataTable
        data={rows}
        columns={columns.map(column => (column.fixed === "left" ? { ...column, fixed: undefined } : column))}
        getRowId={(row: Row) => row.id}
        bulkActions={[{ label: "Supprimer", onClick: () => undefined }]}
      />,
    );

    expect(headerCell(container, SELECTION_COLUMN_KEY).getAttribute("data-fixed-side")).toBeNull();
  });
});
