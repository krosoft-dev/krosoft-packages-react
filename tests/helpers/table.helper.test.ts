import { describe, it, expect } from "vitest";
import { ACTIONS_COLUMN_KEY, getAlignmentClass, getColumnAlignment, getFixedCellProps, SELECTION_COLUMN_KEY } from "../../src/helpers";
import type { DataTableColumn } from "../../src/types";

type Row = { id: string };
const column = (over: Partial<DataTableColumn<Row>> = {}): DataTableColumn<Row> => ({ key: "k", headerKey: "K", ...over });

describe("getColumnAlignment", () => {
  it("donne la priorité à `align` explicite", () => {
    expect(getColumnAlignment(column({ align: "center", className: "text-right" }))).toBe("center");
  });

  it("déduit l'alignement depuis `className` quand `align` est absent", () => {
    expect(getColumnAlignment(column({ className: "text-right" }))).toBe("right");
    expect(getColumnAlignment(column({ className: "font-bold text-center" }))).toBe("center");
  });

  it("retombe sur `left` par défaut", () => {
    expect(getColumnAlignment(column())).toBe("left");
    expect(getColumnAlignment(column({ className: "font-medium" }))).toBe("left");
  });
});

describe("getAlignmentClass", () => {
  it("mappe chaque alignement sur sa classe utilitaire", () => {
    expect(getAlignmentClass("left")).toBe("text-left");
    expect(getAlignmentClass("center")).toBe("text-center");
    expect(getAlignmentClass("right")).toBe("text-right");
  });
});

describe("colonnes fixes — clés", () => {
  it("expose des clés distinctes pour la sélection et les actions", () => {
    expect(SELECTION_COLUMN_KEY).not.toBe(ACTIONS_COLUMN_KEY);
  });
});

describe("getFixedCellProps", () => {
  it("retourne juste `relative` (sans style) hors colonne figée", () => {
    const props = getFixedCellProps(undefined, "body");

    expect(props.className).toBe("relative");
    expect(props.style).toEqual({});
  });

  it("rend la cellule collante et pose le calque de fond, avec un z-index d'en-tête supérieur", () => {
    const header = getFixedCellProps({ side: "left", offset: 0, isEdge: false }, "header");
    const body = getFixedCellProps({ side: "left", offset: 0, isEdge: false }, "body");

    expect(header.className).toContain("sticky");
    expect(header.className).toContain("z-20");
    expect(header.className).toContain("before:bg-muted/50");
    // Le corps peint son fond au survol de la ligne (groupe) et passe sous l'en-tête.
    expect(body.className).toContain("z-10");
    expect(body.className).toContain("group-hover:before:bg-muted/50");
  });

  it("positionne la cellule selon le bord et n'ajoute la séparation que sur une colonne de bord", () => {
    const left = getFixedCellProps({ side: "left", offset: 120, isEdge: true }, "body");
    const right = getFixedCellProps({ side: "right", offset: 40, isEdge: false }, "body");

    expect(left.style).toEqual({ left: 120 });
    expect(left.className).toContain("border-r border-border");
    expect(right.style).toEqual({ right: 40 });
    expect(right.className).not.toContain("border-l");
  });
});
