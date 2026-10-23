import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { localStorageColumnVisibility } from "../../../src/helpers/table.helper";
import { useDataTable } from "../../../src/hooks/ui/useDataTable";
import type { DataTableColumn } from "../../../src/types/DataTableColumn";
import type { DataTableColumnVisibilityState } from "../../../src/types/DataTableColumnVisibilityState";
import type { DataTableColumnVisibilityStorage } from "../../../src/types/DataTableColumnVisibilityStorage";
import type { UseDataTableProps } from "../../../src/types/UseDataTableProps";
import type { UseDataTableResult } from "../../../src/types/UseDataTableResult";

type Row = { id: string; name: string; email: string; role: string };

const columns: DataTableColumn<Row>[] = [
  { key: "name", headerKey: "Name" },
  { key: "email", headerKey: "Email" },
  { key: "role", headerKey: "Role", defaultVisible: false },
];

const STORAGE_KEY = "test.columns";

const renderTable = (props: Partial<UseDataTableProps<Row>> = {}): RenderHookResult<UseDataTableResult<Row>, Partial<UseDataTableProps<Row>>> =>
  renderHook((overrides: Partial<UseDataTableProps<Row>>) => useDataTable<Row>({ data: [], columns, rowKey: row => row.id, pageSizeDefault: 10, ...props, ...overrides }), {
    initialProps: {},
  });

const visibleKeys = (visible: Set<string>): string[] => [...visible].sort();

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("useDataTable — visibilité des colonnes", () => {
  it("applique defaultVisible et garde toujours la première colonne affichée", () => {
    const { result } = renderTable({ columnVisibilityState: { name: false } });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name"]);
  });

  it("ignore la première colonne dans « Aucun »", () => {
    const { result } = renderTable();

    act(() => {
      result.current.setColumnsVisibility(["name", "email", "role"], false);
    });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["name"]);
  });
});

describe("useDataTable — mode contrôlé", () => {
  it("n'applique pas le changement lui-même et transmet le nouvel état à l'application", () => {
    const onChange = vi.fn<(state: DataTableColumnVisibilityState) => void>();
    const { result, rerender } = renderTable({ columnVisibilityState: {}, onColumnVisibilityChange: onChange });

    act(() => {
      result.current.toggleColumnVisibility("email");
    });

    expect(onChange).toHaveBeenCalledWith({ email: false });
    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name"]);

    rerender({ columnVisibilityState: { email: false } });
    expect(visibleKeys(result.current.visibleColumns)).toEqual(["name"]);
  });

  it("ignore le localStorage quand l'état est contrôlé", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: true }));
    const { result } = renderTable({ columnVisibilityState: {}, columnVisibilityStorage: localStorageColumnVisibility(STORAGE_KEY) });

    act(() => {
      result.current.toggleColumnVisibility("email");
    });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name"]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ role: true }));
  });
});

describe("useDataTable — persistance localStorage", () => {
  it("relit la visibilité enregistrée au montage", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: false, role: true }));
    const { result } = renderTable({ columnVisibilityStorage: localStorageColumnVisibility(STORAGE_KEY) });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["name", "role"]);
  });

  it("enregistre chaque changement et prévient quand même l'application", () => {
    const onChange = vi.fn<(state: DataTableColumnVisibilityState) => void>();
    const { result } = renderTable({ columnVisibilityStorage: localStorageColumnVisibility(STORAGE_KEY), onColumnVisibilityChange: onChange });

    act(() => {
      result.current.setColumnsVisibility(["role"], true);
    });

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}")).toEqual({ role: true });
    expect(onChange).toHaveBeenCalledWith({ role: true });
    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name", "role"]);
  });

  it("retombe sur les colonnes par défaut si la valeur enregistrée est illisible", () => {
    window.localStorage.setItem(STORAGE_KEY, "{pas du json");
    const { result } = renderTable({ columnVisibilityStorage: localStorageColumnVisibility(STORAGE_KEY) });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name"]);
  });

  it("ignore les valeurs non booléennes et les colonnes disparues", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: "non", role: true, ancienneColonne: false }));
    const { result } = renderTable({ columnVisibilityStorage: localStorageColumnVisibility(STORAGE_KEY) });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name", "role"]);
  });

  it("garde le changement pour la session si le localStorage refuse l'écriture", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const { result } = renderTable({ columnVisibilityStorage: localStorageColumnVisibility(STORAGE_KEY) });

    act(() => {
      result.current.toggleColumnVisibility("email");
    });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["name"]);
  });
});

describe("useDataTable — stockage personnalisé", () => {
  it("lit et écrit via l'adaptateur fourni, sans toucher au localStorage", () => {
    const write = vi.fn<(state: DataTableColumnVisibilityState) => void>();
    const storage: DataTableColumnVisibilityStorage = { read: () => ({ role: true }), write };
    const { result } = renderTable({ columnVisibilityStorage: storage });

    expect(visibleKeys(result.current.visibleColumns)).toEqual(["email", "name", "role"]);

    act(() => {
      result.current.toggleColumnVisibility("email");
    });

    expect(write).toHaveBeenCalledWith({ role: true, email: false });
    expect(window.localStorage.length).toBe(0);
  });
});
