import { useLayoutEffect, useState, type RefObject } from "react";

/** Position calculée d'une cellule figée, partagée par l'en-tête et le corps du tableau. */
export interface FixedColumnOffset {
  /** Bord du conteneur auquel la colonne est accrochée. */
  side: "left" | "right";
  /** Décalage en pixels par rapport à ce bord, largeur cumulée des colonnes figées qui précèdent. */
  offset: number;
  /** Vrai pour la colonne figée la plus proche de la zone qui défile : c'est elle qui porte la séparation. */
  isEdge: boolean;
}

const areOffsetsEqual = (previous: Record<string, FixedColumnOffset>, next: Record<string, FixedColumnOffset>): boolean => {
  const previousKeys = Object.keys(previous);
  if (previousKeys.length !== Object.keys(next).length) return false;
  return previousKeys.every(key => {
    const before = previous[key];
    const after = next[key];
    return before.side === after?.side && before.offset === after.offset && before.isEdge === after.isEdge;
  });
};

/**
 * Mesure les colonnes figées d'un tableau et renvoie leur décalage, indexé par clé de colonne.
 *
 * Les décalages sont pris sur les cellules de l'en-tête : c'est la seule ligne dont on est sûr
 * qu'elle contient toutes les colonnes, et sa largeur est par construction celle de la colonne
 * entière. En-tête et corps partagent donc la même mesure, ce qui évite qu'un `th` reste dans le
 * flux pendant que le `td` correspondant est déjà accroché au bord.
 *
 * La mesure est refaite à chaque rendu — une colonne masquée, réordonnée ou redimensionnée change
 * les largeurs sans redimensionner le tableau lui-même, qui occupe toujours 100% de son conteneur.
 */
export function useFixedColumns(tableRef: RefObject<HTMLTableElement | null>): Record<string, FixedColumnOffset> {
  const [offsets, setOffsets] = useState<Record<string, FixedColumnOffset>>({});

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    let cells: HTMLTableCellElement[] = [];

    const update = (): void => {
      cells = Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th[data-fixed-side]"));
      const next: Record<string, FixedColumnOffset> = {};

      // Les colonnes de gauche s'empilent depuis le bord gauche dans l'ordre du DOM, celles de
      // droite depuis le bord droit donc dans l'ordre inverse.
      const stack = (group: HTMLTableCellElement[], side: "left" | "right"): void => {
        let offset = 0;
        group.forEach((cell, index) => {
          const key = cell.dataset.columnKey;
          if (key === undefined) return;
          next[key] = { side, offset, isEdge: index === group.length - 1 };
          offset += cell.getBoundingClientRect().width;
        });
      };

      stack(
        cells.filter(cell => cell.dataset.fixedSide === "left"),
        "left",
      );
      stack(cells.filter(cell => cell.dataset.fixedSide === "right").reverse(), "right");

      // Conserver l'objet précédent à l'identique évite une boucle de rendu : l'effet tourne à
      // chaque rendu, il ne doit en déclencher un nouveau que si les positions ont bougé.
      setOffsets(previous => (areOffsetsEqual(previous, next) ? previous : next));
    };

    update();
    // ResizeObserver n'existe pas dans jsdom : sans ce garde, tout test rendant le tableau planterait.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(table);
    // Le tableau garde la même largeur quand une colonne est redimensionnée : il faut observer les
    // cellules figées elles-mêmes pour rattraper ces changements venus de l'extérieur du rendu.
    cells.forEach(cell => observer?.observe(cell));

    return () => {
      observer?.disconnect();
    };
  });

  return offsets;
}
