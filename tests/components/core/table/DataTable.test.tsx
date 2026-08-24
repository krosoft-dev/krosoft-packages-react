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

describe("DataTable — alignement des colonnes", () => {
  const alignedColumns: ColumnDef<Row>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email", align: "right" },
    { key: "role", label: "Role", className: "text-right" },
  ];

  it("range le libellé du même côté que les cellules quand la colonne est alignée à droite", () => {
    const container = renderTable({ columns: alignedColumns });

    for (const key of ["email", "role"]) {
      const header = headerCell(container, key);
      expect(header.className).toContain("text-right");
      // L'en-tête par défaut pousse le libellé à gauche et l'icône de tri à droite : sur une
      // colonne alignée à droite les deux doivent se regrouper au bord droit.
      expect(header.querySelector("div")?.className).toContain("justify-end");
      expect(header.querySelector("div")?.className).not.toContain("justify-between");
    }
  });

  it("laisse l'en-tête par défaut aux colonnes alignées à gauche", () => {
    const container = renderTable({ columns: alignedColumns });

    const header = headerCell(container, "name");
    expect(header.className).toContain("text-left");
    expect(header.querySelector("div")?.className).toContain("justify-start");
  });

  it("colle l'icône de tri au libellé plutôt qu'au bord de la colonne", () => {
    const container = renderTable({ columns: [{ key: "name", label: "Name", sortable: true }] });

    const contenu = headerCell(container, "name").querySelector("div");
    // Rien ne doit pousser l'icône à l'autre extrémité : elle qualifie le libellé, pas la colonne.
    expect(contenu?.className).not.toContain("justify-between");
    expect(contenu?.children.length).toBe(2);
    expect(contenu?.firstElementChild?.textContent).toBe("Name");
    expect(contenu?.lastElementChild?.querySelector("svg")).toBeTruthy();
  });

  it("n'ajoute aucun élément d'icône sur une colonne non triable", () => {
    const container = renderTable({ columns: [{ key: "name", label: "Name" }] });

    // Un conteneur d'icône vide ouvrirait une gouttière après le libellé.
    expect(headerCell(container, "name").querySelector("div")?.children.length).toBe(1);
  });

  it("aligne les cellules quand l'alignement vient de align", () => {
    const container = renderTable({ columns: alignedColumns });

    expect(bodyCells(container, "email").every(cell => cell.className.includes("text-right"))).toBe(true);
    expect(bodyCells(container, "name").every(cell => cell.className.includes("text-left"))).toBe(true);
  });

  it("garde l'icône de tri à droite du libellé, même sur une colonne alignée à droite", () => {
    const container = renderTable({ columns: [{ key: "name", label: "Name", align: "right", sortable: true }] });

    const header = headerCell(container, "name");
    const contenu = header.querySelector("div");
    expect(contenu?.firstElementChild?.textContent).toBe("Name");
    expect(contenu?.lastElementChild?.querySelector("svg")).toBeTruthy();
    // Pas de retrait à droite : il éloignerait l'en-tête du bord sur lequel les cellules s'alignent.
    expect(contenu?.className).not.toContain("pr-2");
  });

  it("rétablit le retrait droit sur une colonne redimensionnable, pour dégager la poignée", () => {
    const container = renderTable({ columns: [{ key: "name", label: "Name", align: "right", sortable: true }], resizableColumns: true });

    expect(headerCell(container, "name").querySelector("div")?.className).toContain("pr-2");
  });

  it("centre l'en-tête d'une colonne centrée", () => {
    const container = renderTable({ columns: [{ key: "name", label: "Name", align: "center" }] });

    const header = headerCell(container, "name");
    expect(header.className).toContain("text-center");
    expect(header.querySelector("div")?.className).toContain("justify-center");
  });

  it("colle les actions au bord droit de leur colonne", () => {
    const container = renderTable({ actions: [{ label: "Run", onClick: () => {} }] });

    const cells = bodyCells(container, ACTIONS_COLUMN_KEY);
    expect(cells.every(cell => cell.className.includes("text-right"))).toBe(true);
    // Le conteneur flex doit pousser les boutons contre le bord sur lequel l'œil cale la colonne.
    expect(cells.every(cell => cell.querySelector("div")?.className.includes("justify-end") === true)).toBe(true);
    expect(headerCell(container, ACTIONS_COLUMN_KEY).className).toContain("text-right");
  });
});

describe("DataTable — mode dense", () => {
  it("resserre le padding vertical des en-têtes et des cellules en mode dense", () => {
    const container = renderTable({ dense: true });

    const header = headerCell(container, "email");
    expect(header.className).toContain("py-1");
    expect(header.className).not.toContain("py-2");
    expect(bodyCells(container, "email").every(cell => cell.className.includes("py-1"))).toBe(true);
    expect(bodyCells(container, "email").every(cell => !cell.className.includes("py-2"))).toBe(true);
  });

  it("garde le padding vertical par défaut hors mode dense", () => {
    const container = renderTable();

    expect(headerCell(container, "email").className).toContain("py-3");
    expect(bodyCells(container, "email").every(cell => cell.className.includes("py-3"))).toBe(true);
  });

  it("laisse les cellules de sélection et d'actions déjà compactes suivre la hauteur des lignes", () => {
    const container = renderTable({
      dense: true,
      bulkActions: [{ label: "Supprimer", onClick: () => undefined }],
      actions: [{ label: "Modifier", onClick: () => undefined }],
    });

    // Elles restent en p-1 : la hauteur des lignes est dictée par les colonnes de données.
    for (const key of [SELECTION_COLUMN_KEY, ACTIONS_COLUMN_KEY]) {
      expect(headerCell(container, key).className).toContain("p-1");
      expect(bodyCells(container, key).every(cell => cell.className.includes("p-1"))).toBe(true);
    }
  });
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
