import type { ColumnDef } from "@/types";

export type ColumnAlignment = "left" | "center" | "right";

const ALIGNMENT_CLASSES: Record<ColumnAlignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Alignement horizontal d'une colonne, en-tête compris.
 *
 * `align` sur le `ColumnDef` fait autorité. À défaut, l'alignement est déduit de `className` :
 * poser `text-right` sur une colonne de nombres est le réflexe naturel, et l'en-tête doit suivre
 * ses cellules sans qu'on ait à le déclarer deux fois.
 */
export function getColumnAlignment<T>(column: ColumnDef<T>): ColumnAlignment {
  if (column.align !== undefined) return column.align;

  const classes = (column.className ?? "").split(/\s+/);
  if (classes.includes("text-right")) return "right";
  if (classes.includes("text-center")) return "center";
  return "left";
}

/** Classe d'alignement à poser sur la cellule, quand elle ne vient pas déjà de `className`. */
export function getAlignmentClass(alignment: ColumnAlignment): string {
  return ALIGNMENT_CLASSES[alignment];
}
