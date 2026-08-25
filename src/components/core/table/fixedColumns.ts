import type { FixedColumnOffset } from "@/hooks/ui/useFixedColumns";
import type React from "react";

/** Clés internes des deux colonnes qui n'ont pas de `ColumnDef` : la sélection et les actions. */
export const SELECTION_COLUMN_KEY = "__selection__";
export const ACTIONS_COLUMN_KEY = "__actions__";

const edgeBorder: Record<"left" | "right", string> = {
  left: "border-r border-border",
  right: "border-l border-border",
};

export interface FixedCellProps {
  className: string;
  style: React.CSSProperties;
}

/**
 * Classes et style d'une cellule figée, à appliquer aussi bien au `th` qu'au `td` de la colonne.
 *
 * Une cellule figée sort du flux de défilement : le reste de la ligne passe dessous, elle doit
 * donc peindre son propre fond. Les fonds du tableau étant translucides (teinte de l'en-tête,
 * survol de ligne), ils sont rejoués dans un calque `::before` posé sur un fond opaque, sinon la
 * colonne figée serait plus claire ou plus foncée que les colonnes qui défilent.
 */
export function getFixedCellProps(offset: FixedColumnOffset | undefined, variant: "header" | "body"): FixedCellProps {
  // `relative` reste nécessaire hors colonne figée : la poignée de redimensionnement et les
  // rendus de cellule personnalisés se positionnent par rapport à la cellule.
  if (offset === undefined) return { className: "relative", style: {} };

  const isHeader = variant === "header";

  return {
    className: [
      "sticky bg-card",
      // L'en-tête doit passer au-dessus des cellules figées du corps quand elles se croisent.
      isHeader ? "z-20" : "z-10",
      "before:absolute before:inset-0 before:-z-10 before:pointer-events-none",
      isHeader ? "before:bg-muted/50" : "group-hover:before:bg-muted/50",
      // Séparation posée du seul côté qui donne sur la zone qui défile.
      offset.isEdge ? edgeBorder[offset.side] : "",
    ]
      .filter(Boolean)
      .join(" "),
    style: offset.side === "left" ? { left: offset.offset } : { right: offset.offset },
  };
}
