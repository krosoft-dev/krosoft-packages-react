import { renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDataTable } from "../../../src/hooks/ui/useDataTable";
import type { DataTableColumn } from "../../../src/types/DataTableColumn";
import type { UseDataTableProps } from "../../../src/types/UseDataTableProps";
import type { UseDataTableResult } from "../../../src/types/UseDataTableResult";

type Row = { id: string; name: string; lastModifiedUtc: string };

const data: Row[] = [
  { id: "1", name: "b.log", lastModifiedUtc: "2026-01-02" },
  { id: "2", name: "a.log", lastModifiedUtc: "2026-01-01" },
  { id: "3", name: "c.log", lastModifiedUtc: "2026-01-03" },
];

const columns: DataTableColumn<Row>[] = [
  { key: "name", headerKey: "Name", sortable: true },
  { key: "lastModifiedUtc", headerKey: "Modified", sortable: true },
];

const renderTable = (props: Partial<UseDataTableProps<Row>> = {}): RenderHookResult<UseDataTableResult<Row>, unknown> =>
  renderHook(() => useDataTable<Row>({ data, columns, rowKey: row => row.id, pageSizeDefault: 10, ...props }));

const ids = (rows: Row[]): string[] => rows.map(row => row.id);

describe("useDataTable — tri par défaut", () => {
  it("trie par ordre ascendant sur la première colonne triable sans defaultSort", () => {
    const { result } = renderTable();

    expect(result.current.sortColumn).toBe("name");
    expect(result.current.sortDirection).toBe("asc");
    expect(ids(result.current.paginatedData)).toEqual(["2", "1", "3"]);
  });

  it("applique la colonne et la direction de defaultSort", () => {
    const { result } = renderTable({ defaultSort: { column: "lastModifiedUtc", direction: "desc" } });

    expect(result.current.sortColumn).toBe("lastModifiedUtc");
    expect(result.current.sortDirection).toBe("desc");
    expect(ids(result.current.paginatedData)).toEqual(["3", "1", "2"]);
  });

  it("laisse le tri contrôlé prioritaire sur defaultSort", () => {
    const { result } = renderTable({
      defaultSort: { column: "lastModifiedUtc", direction: "desc" },
      server: { totalRows: 3, currentPage: 1, pageSize: 10, onPageChange: () => {}, onPageSizeChange: () => {}, sortColumn: "name", sortDirection: "asc" },
    });

    expect(result.current.sortColumn).toBe("name");
    expect(result.current.sortDirection).toBe("asc");
  });
});
