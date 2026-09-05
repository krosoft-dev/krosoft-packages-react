import { cleanup, fireEvent, render } from "@testing-library/react";
import { createInstance } from "i18next";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "../../../../src/components/core/table/DataTable";
import { ACTIONS_COLUMN_KEY, SELECTION_COLUMN_KEY } from "../../../../src/helpers/table.helper";
import type { DataTableColumn } from "../../../../src/types/DataTableColumn";
import type { DataTableConfig } from "../../../../src/types/DataTableConfig";

// Le DataTable navigue via useNavigate : le mock évite d'envelopper chaque test dans un Router.
const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));
vi.mock("react-router-dom", async importOriginal => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigateMock,
}));

type Row = { id: string; name: string; email: string; role: string };

const rows: Row[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
];

const columns: DataTableColumn<Row>[] = [
  { key: "name", headerKey: "Name", fixed: "left" },
  { key: "email", headerKey: "Email" },
  { key: "role", headerKey: "Role", fixed: "right" },
];

type TableOverrides = Partial<Omit<React.ComponentProps<typeof DataTable<Row>>, "config">> & { config?: Partial<DataTableConfig<Row>> };

const renderTable = ({ config, ...props }: TableOverrides = {}): HTMLElement => {
  const { container } = render(<DataTable data={rows} config={{ columns, rowKey: (row: Row) => row.id, ...config }} {...props} />);
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
  navigateMock.mockClear();
});

describe("DataTable — alignement des colonnes", () => {
  const alignedColumns: DataTableColumn<Row>[] = [
    { key: "name", headerKey: "Name" },
    { key: "email", headerKey: "Email", align: "right" },
    { key: "role", headerKey: "Role", className: "text-right" },
  ];

  it("range le libellé du même côté que les cellules quand la colonne est alignée à droite", () => {
    const container = renderTable({ config: { columns: alignedColumns } });

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
    const container = renderTable({ config: { columns: alignedColumns } });

    const header = headerCell(container, "name");
    expect(header.className).toContain("text-left");
    expect(header.querySelector("div")?.className).toContain("justify-start");
  });

  it("colle l'icône de tri au libellé plutôt qu'au bord de la colonne", () => {
    const container = renderTable({ config: { columns: [{ key: "name", headerKey: "Name", sortable: true }] } });

    const contenu = headerCell(container, "name").querySelector("div");
    // Rien ne doit pousser l'icône à l'autre extrémité : elle qualifie le libellé, pas la colonne.
    expect(contenu?.className).not.toContain("justify-between");
    expect(contenu?.children.length).toBe(2);
    expect(contenu?.firstElementChild?.textContent).toBe("Name");
    expect(contenu?.lastElementChild?.querySelector("svg")).toBeTruthy();
  });

  it("n'ajoute aucun élément d'icône sur une colonne non triable", () => {
    const container = renderTable({ config: { columns: [{ key: "name", headerKey: "Name" }] } });

    // Un conteneur d'icône vide ouvrirait une gouttière après le libellé.
    expect(headerCell(container, "name").querySelector("div")?.children.length).toBe(1);
  });

  it("aligne les cellules quand l'alignement vient de align", () => {
    const container = renderTable({ config: { columns: alignedColumns } });

    expect(bodyCells(container, "email").every(cell => cell.className.includes("text-right"))).toBe(true);
    expect(bodyCells(container, "name").every(cell => cell.className.includes("text-left"))).toBe(true);
  });

  it("garde l'icône de tri à droite du libellé, même sur une colonne alignée à droite", () => {
    const container = renderTable({ config: { columns: [{ key: "name", headerKey: "Name", align: "right", sortable: true }] } });

    const header = headerCell(container, "name");
    const contenu = header.querySelector("div");
    expect(contenu?.firstElementChild?.textContent).toBe("Name");
    expect(contenu?.lastElementChild?.querySelector("svg")).toBeTruthy();
    // Pas de retrait à droite : il éloignerait l'en-tête du bord sur lequel les cellules s'alignent.
    expect(contenu?.className).not.toContain("pr-2");
  });

  it("rétablit le retrait droit sur une colonne redimensionnable, pour dégager la poignée", () => {
    const container = renderTable({ config: { columns: [{ key: "name", headerKey: "Name", align: "right", sortable: true }], resizableColumns: true } });

    expect(headerCell(container, "name").querySelector("div")?.className).toContain("pr-2");
  });

  it("centre l'en-tête d'une colonne centrée", () => {
    const container = renderTable({ config: { columns: [{ key: "name", headerKey: "Name", align: "center" }] } });

    const header = headerCell(container, "name");
    expect(header.className).toContain("text-center");
    expect(header.querySelector("div")?.className).toContain("justify-center");
  });

  it("colle les actions au bord droit de leur colonne", () => {
    const container = renderTable({ config: { actions: [{ labelKey: "Run", onClick: () => {} }] } });

    const cells = bodyCells(container, ACTIONS_COLUMN_KEY);
    expect(cells.every(cell => cell.className.includes("text-right"))).toBe(true);
    // Le conteneur flex doit pousser les boutons contre le bord sur lequel l'œil cale la colonne.
    expect(cells.every(cell => cell.querySelector("div")?.className.includes("justify-end") === true)).toBe(true);
    expect(headerCell(container, ACTIONS_COLUMN_KEY).className).toContain("text-right");
  });
});

describe("DataTable — mode dense", () => {
  it("resserre le padding vertical des en-têtes et des cellules en mode dense", () => {
    const container = renderTable({ config: { dense: true } });

    const header = headerCell(container, "email");
    expect(header.className).toContain("py-2");
    expect(header.className).not.toContain("py-4");
    expect(bodyCells(container, "email").every(cell => cell.className.includes("py-2"))).toBe(true);
    expect(bodyCells(container, "email").every(cell => !cell.className.includes("py-4"))).toBe(true);
  });

  it("garde le padding vertical par défaut hors mode dense", () => {
    const container = renderTable();

    expect(headerCell(container, "email").className).toContain("py-4");
    expect(bodyCells(container, "email").every(cell => cell.className.includes("py-4"))).toBe(true);
  });

  it("laisse les cellules de sélection et d'actions déjà compactes suivre la hauteur des lignes", () => {
    const container = renderTable({
      config: {
        dense: true,
        bulkActions: [{ labelKey: "Supprimer", onClick: () => undefined }],
        actions: [{ labelKey: "Modifier", onClick: () => undefined }],
      },
    });

    // Elles gardent leur padding compact propre (p-1 pour la sélection, py-1 pour les actions) :
    // la hauteur des lignes est dictée par les colonnes de données, pas par ces cellules fixes.
    const compactPadding: Record<string, string> = {
      [SELECTION_COLUMN_KEY]: "p-1",
      [ACTIONS_COLUMN_KEY]: "py-1",
    };
    for (const [key, padding] of Object.entries(compactPadding)) {
      expect(headerCell(container, key).className).toContain(padding);
      expect(bodyCells(container, key).every(cell => cell.className.includes(padding))).toBe(true);
      // Elles ne prennent jamais le padding vertical des colonnes de données.
      expect(headerCell(container, key).className).not.toContain("py-2");
      expect(bodyCells(container, key).every(cell => !cell.className.includes("py-2"))).toBe(true);
    }
  });
});

describe("DataTable — messages d'état", () => {
  it("affiche le libellé vide par défaut du package quand il n'y a aucune donnée", () => {
    const container = renderTable({ data: [] });

    expect(container.textContent).toContain("Aucun résultat");
  });

  it("affiche la clé i18n vide fournie via config.messages", () => {
    const container = renderTable({ data: [], config: { messages: { emptyKey: "Aucun flux trouvé" } } });

    expect(container.textContent).toContain("Aucun flux trouvé");
    expect(container.textContent).not.toContain("Aucun résultat");
  });

  it("affiche le libellé de chargement par défaut du package", () => {
    const container = renderTable({ isLoading: true });

    expect(container.textContent).toContain("Chargement...");
  });

  it("affiche la clé i18n de chargement fournie via config.messages", () => {
    const container = renderTable({ isLoading: true, config: { messages: { loadingKey: "Chargement des flux..." } } });

    expect(container.textContent).toContain("Chargement des flux...");
    expect(container.textContent).not.toContain("Chargement...");
  });
});

describe("DataTable — i18n", () => {
  it("résout labelKey des actions de ligne dans le namespace de l'application", async () => {
    // Instance locale passée par Provider : le test ne touche pas l'i18next global.
    const i18nInstance = createInstance();
    await i18nInstance.init({ lng: "fr", resources: { fr: { translation: { "actions.edit": "Modifier" } } } });

    const { container } = render(
      <I18nextProvider i18n={i18nInstance}>
        <DataTable data={rows} config={{ columns, rowKey: (row: Row) => row.id, actions: [{ labelKey: "actions.edit", onClick: () => undefined }] }} />
      </I18nextProvider>,
    );

    const actionsCell = bodyCells(container, ACTIONS_COLUMN_KEY)[0];
    expect(actionsCell.textContent).toContain("Modifier");
    expect(actionsCell.textContent).not.toContain("actions.edit");
  });

  it("résout labelKey des actions groupées dans le namespace de l'application", async () => {
    // Instance locale passée par Provider : le test ne touche pas l'i18next global.
    const i18nInstance = createInstance();
    await i18nInstance.init({ lng: "fr", resources: { fr: { translation: { "actions.deleteAll": "Tout supprimer" } } } });

    const { container } = render(
      <I18nextProvider i18n={i18nInstance}>
        <DataTable data={rows} config={{ columns, rowKey: (row: Row) => row.id, bulkActions: [{ labelKey: "actions.deleteAll", onClick: () => undefined }] }} />
      </I18nextProvider>,
    );

    // Le bandeau n'apparaît qu'avec une sélection active.
    const checkbox = bodyCells(container, SELECTION_COLUMN_KEY)[0].querySelector('[role="checkbox"]');
    if (checkbox === null) throw new Error("Case de sélection introuvable");
    fireEvent.click(checkbox);

    expect(container.textContent).toContain("Tout supprimer");
    expect(container.textContent).not.toContain("actions.deleteAll");
    // Les libellés propres au bandeau viennent du package (repli français embarqué ici).
    expect(container.textContent).toContain("1 sélectionné(s)");
    expect(container.textContent).toContain("Désélectionner");
  });

  it("résout headerKey dans le namespace de l'application, et retombe sur la clé sans traduction", async () => {
    // Instance locale passée par Provider : le test ne touche pas l'i18next global.
    const i18nInstance = createInstance();
    await i18nInstance.init({ lng: "fr", resources: { fr: { translation: { "columns.name": "Nom" } } } });

    const { container } = render(
      <I18nextProvider i18n={i18nInstance}>
        <DataTable
          data={rows}
          config={{
            columns: [
              { key: "name", headerKey: "columns.name" },
              { key: "email", headerKey: "Email" },
            ],
            rowKey: (row: Row) => row.id,
          }}
        />
      </I18nextProvider>,
    );

    expect(headerCell(container, "name").textContent).toContain("Nom");
    expect(headerCell(container, "name").textContent).not.toContain("columns.name");
    expect(headerCell(container, "email").textContent).toContain("Email");
  });
});

describe("DataTable — navigation au clic", () => {
  const firstRow = (container: HTMLElement): HTMLTableRowElement => {
    const row = container.querySelector<HTMLTableRowElement>("tbody tr");
    if (row === null) throw new Error("Aucune ligne trouvée dans le tableau");
    return row;
  };

  const rowAt = (container: HTMLElement, index: number): HTMLTableRowElement => {
    const row = container.querySelectorAll<HTMLTableRowElement>("tbody tr")[index];
    if (row === undefined) throw new Error(`Aucune ligne à l'index ${String(index)}`);
    return row;
  };

  it("navigue via le router avec l'URL calculée au clic sur une ligne", () => {
    const container = renderTable({ config: { onRowNavigate: (row: Row) => `/users/${row.id}` } });

    fireEvent.click(firstRow(container));

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith("/users/1");
  });

  it("ouvre l'URL dans un nouvel onglet au Ctrl+clic ou Cmd+clic, sans passer par le router", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const container = renderTable({ config: { onRowNavigate: (row: Row) => `/users/${row.id}` } });

    fireEvent.click(firstRow(container), { ctrlKey: true });
    fireEvent.click(firstRow(container), { metaKey: true });

    expect(open).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenNthCalledWith(1, "/users/1", "_blank");
    expect(open).toHaveBeenNthCalledWith(2, "/users/1", "_blank");
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("donne la priorité à onRowNavigate sur onRowClick", () => {
    const onRowClick = vi.fn();
    const container = renderTable({ config: { onRowNavigate: (row: Row) => `/users/${row.id}`, onRowClick } });

    fireEvent.click(firstRow(container));

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith("/users/1");
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("affiche le curseur pointeur sur les lignes quand onRowNavigate est fourni", () => {
    const container = renderTable({ config: { onRowNavigate: (row: Row) => `/users/${row.id}` } });

    expect(firstRow(container).className).toContain("cursor-pointer");
  });

  it("ne navigue pas et retire le curseur pointeur sur une ligne non navigable", () => {
    const container = renderTable({
      config: { onRowNavigate: (row: Row) => `/users/${row.id}`, rowNavigable: (row: Row) => row.id === "1" },
    });

    fireEvent.click(rowAt(container, 1));

    expect(navigateMock).not.toHaveBeenCalled();
    expect(rowAt(container, 0).className).toContain("cursor-pointer");
    expect(rowAt(container, 1).className).not.toContain("cursor-pointer");
  });

  it("retombe sur onRowClick pour une ligne non navigable", () => {
    const onRowClick = vi.fn();
    const container = renderTable({ config: { onRowNavigate: (row: Row) => `/users/${row.id}`, rowNavigable: () => false, onRowClick } });

    fireEvent.click(firstRow(container));

    expect(navigateMock).not.toHaveBeenCalled();
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("ne déclenche pas la navigation au clic sur la case de sélection ou la colonne d'actions", () => {
    const container = renderTable({
      config: {
        onRowNavigate: (row: Row) => `/users/${row.id}`,
        bulkActions: [{ labelKey: "Supprimer", onClick: () => undefined }],
        actions: [{ labelKey: "Modifier", onClick: () => undefined }],
      },
    });

    for (const key of [SELECTION_COLUMN_KEY, ACTIONS_COLUMN_KEY]) {
      fireEvent.click(bodyCells(container, key)[0]);
    }

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("bascule la sélection au clic sur une ligne tant qu'une sélection est en cours", () => {
    const onRowClick = vi.fn();
    const container = renderTable({
      config: {
        onRowNavigate: (row: Row) => `/users/${row.id}`,
        onRowClick,
        bulkActions: [{ labelKey: "Supprimer", onClick: () => undefined }],
      },
    });

    const rowCheckbox = (index: number): Element => {
      const checkbox = bodyCells(container, SELECTION_COLUMN_KEY)[index].querySelector('[role="checkbox"]');
      if (checkbox === null) throw new Error("Case de sélection introuvable");
      return checkbox;
    };
    fireEvent.click(rowCheckbox(0));

    // Sélection active : le clic sur une autre ligne la coche au lieu de naviguer.
    const secondRow = container.querySelectorAll<HTMLTableRowElement>("tbody tr")[1];
    fireEvent.click(secondRow);
    expect(navigateMock).not.toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();
    expect(rowCheckbox(1).getAttribute("data-state")).toBe("checked");

    // Re-clic : la ligne se décoche.
    fireEvent.click(secondRow);
    expect(rowCheckbox(1).getAttribute("data-state")).toBe("unchecked");

    // Sélection vidée : le clic redevient navigant.
    fireEvent.click(firstRow(container));
    expect(rowCheckbox(0).getAttribute("data-state")).toBe("unchecked");
    fireEvent.click(firstRow(container));
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith("/users/1");
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
    const container = renderTable({ config: { draggableColumns: true } });

    expect(headerCell(container, "name").draggable).toBe(false);
    expect(headerCell(container, "email").draggable).toBe(true);
  });

  it("fige l'en-tête de la colonne des actions avec ses cellules quand fixedActions est actif", () => {
    const container = renderTable({
      config: { fixedActions: true, actions: [{ labelKey: "Modifier", onClick: () => undefined }] },
    });

    const header = headerCell(container, ACTIONS_COLUMN_KEY);
    expect(header.getAttribute("data-fixed-side")).toBe("right");
    expect(header.className).toContain("sticky");
    expect(bodyCells(container, ACTIONS_COLUMN_KEY).every(cell => cell.className.includes("sticky"))).toBe(true);
  });

  it("fige la case de sélection avec la première colonne figée à gauche", () => {
    const container = renderTable({
      config: { bulkActions: [{ labelKey: "Supprimer", onClick: () => undefined }] },
    });

    const header = headerCell(container, SELECTION_COLUMN_KEY);
    expect(header.getAttribute("data-fixed-side")).toBe("left");
    expect(header.className).toContain("sticky");
    expect(bodyCells(container, SELECTION_COLUMN_KEY).every(cell => cell.className.includes("sticky"))).toBe(true);
  });

  it("empile les colonnes figées du même bord au lieu de les superposer", () => {
    stubColumnWidths({ name: 150, email: 200, role: 100, [ACTIONS_COLUMN_KEY]: 40 });

    const container = renderTable({
      config: {
        columns: [
          { key: "name", headerKey: "Name", fixed: "left" },
          { key: "email", headerKey: "Email", fixed: "left" },
          { key: "role", headerKey: "Role", fixed: "right" },
        ],
        fixedActions: true,
        actions: [{ labelKey: "Modifier", onClick: () => undefined }],
      },
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
        config={{
          columns: columns.map(column => (column.fixed === "left" ? { ...column, fixed: undefined } : column)),
          rowKey: (row: Row) => row.id,
          bulkActions: [{ labelKey: "Supprimer", onClick: () => undefined }],
        }}
      />,
    );

    expect(headerCell(container, SELECTION_COLUMN_KEY).getAttribute("data-fixed-side")).toBeNull();
  });
});

describe("DataTable — colonnes qui changent après le montage", () => {
  const baseColumns: DataTableColumn<Row>[] = [
    { key: "name", headerKey: "Name" },
    { key: "email", headerKey: "Email" },
  ];

  it("affiche une colonne ajoutée après coup, à sa place dans la liste", () => {
    const { container, rerender } = render(<DataTable data={rows} config={{ columns: baseColumns, rowKey: (row: Row) => row.id }} />);

    expect(container.querySelector('thead th[data-column-key="role"]')).toBeNull();

    // La colonne « role » arrive en position 1 (après « name »), typiquement au chargement asynchrone
    // d'une donnée qui conditionne son affichage.
    const withRole: DataTableColumn<Row>[] = [
      { key: "name", headerKey: "Name" },
      { key: "role", headerKey: "Role" },
      { key: "email", headerKey: "Email" },
    ];
    rerender(<DataTable data={rows} config={{ columns: withRole, rowKey: (row: Row) => row.id }} />);

    expect(headerCell(container, "role").textContent).toContain("Role");
    expect(bodyCells(container, "role").map(cell => cell.textContent)).toEqual(["admin", "user"]);
    // Insérée à sa place, pas reléguée en fin de tableau.
    const order = Array.from(container.querySelectorAll("thead th")).map(th => th.getAttribute("data-column-key"));
    expect(order).toEqual(["name", "role", "email"]);
  });

  it("retire une colonne disparue de la liste", () => {
    const withRole: DataTableColumn<Row>[] = [...baseColumns, { key: "role", headerKey: "Role" }];
    const { container, rerender } = render(<DataTable data={rows} config={{ columns: withRole, rowKey: (row: Row) => row.id }} />);

    expect(headerCell(container, "role").textContent).toContain("Role");

    rerender(<DataTable data={rows} config={{ columns: baseColumns, rowKey: (row: Row) => row.id }} />);

    expect(container.querySelector('thead th[data-column-key="role"]')).toBeNull();
  });

  it("préserve le choix de visibilité des colonnes déjà connues quand une nouvelle apparaît", () => {
    const hideableColumns: DataTableColumn<Row>[] = [
      { key: "name", headerKey: "Name" },
      { key: "email", headerKey: "Email", defaultVisible: false },
    ];
    const { container, rerender } = render(<DataTable data={rows} config={{ columns: hideableColumns, rowKey: (row: Row) => row.id }} />);

    // « email » démarre masquée (defaultVisible: false).
    expect(container.querySelector('thead th[data-column-key="email"]')).toBeNull();

    rerender(<DataTable data={rows} config={{ columns: [...hideableColumns, { key: "role", headerKey: "Role" }], rowKey: (row: Row) => row.id }} />);

    // La nouvelle colonne s'affiche, la masquée le reste.
    expect(headerCell(container, "role").textContent).toContain("Role");
    expect(container.querySelector('thead th[data-column-key="email"]')).toBeNull();
  });
});
