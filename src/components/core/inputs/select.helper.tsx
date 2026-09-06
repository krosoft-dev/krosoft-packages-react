import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/helpers/tailwind.helper";

// Au-delà de ce nombre d'options, on ne rend que la fenêtre visible : sans ça, des centaines de
// lignes (case/coche + vignette) sont montées d'un coup et l'ouverture du panneau rame.
const VIRTUALIZE_THRESHOLD = 40;
// Hauteur (px) de la zone scrollable du panneau (`max-h-56`), pour le calcul de la fenêtre.
const LIST_VIEWPORT = 224;
const OVERSCAN = 6;

export interface OptionWindow {
  listRef: React.RefObject<HTMLDivElement | null>;
  /** `true` quand le fenêtrage est actif (au-delà du seuil). En dessous : rendu classique. */
  virtualized: boolean;
  startIndex: number;
  endIndex: number;
  /** Cales à insérer avant / après la tranche visible pour préserver hauteur et position de scroll. */
  padTop: number;
  padBottom: number;
  onScroll: ((e: React.UIEvent<HTMLDivElement>) => void) | undefined;
  /** Remet la liste tout en haut (à l'ouverture / au changement de filtre). */
  resetScroll: () => void;
}

/**
 * Fenêtrage partagé par `SingleSelect` et `MultiSelect` : au-delà de {@link VIRTUALIZE_THRESHOLD}
 * options, seule la tranche visible (+ marge) est montée, encadrée de cales haut/bas. En dessous du
 * seuil, rendu classique — aucun changement de comportement, navigation clavier cmdk intacte.
 *
 * La liste doit être à hauteur de ligne uniforme (cas des selects) : la hauteur réelle d'une ligne
 * est mesurée pour affiner la fenêtre, avec un repli estimé selon la présence de vignettes.
 */
export function useOptionWindow(open: boolean, itemCount: number, hasThumbnails: boolean): OptionWindow {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);

  const estimatedRow = hasThumbnails ? 52 : 40;
  const effectiveRow = rowHeight || estimatedRow;
  const virtualized = itemCount > VIRTUALIZE_THRESHOLD;
  const startIndex = virtualized ? Math.max(0, Math.floor(scrollTop / effectiveRow) - OVERSCAN) : 0;
  const endIndex = virtualized ? Math.min(itemCount, Math.ceil((scrollTop + LIST_VIEWPORT) / effectiveRow) + OVERSCAN) : itemCount;
  const padTop = virtualized ? startIndex * effectiveRow : 0;
  const padBottom = virtualized ? (itemCount - endIndex) * effectiveRow : 0;

  // Mesure réelle d'une ligne (listes à hauteur uniforme) pour affiner la fenêtre.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const item = listRef.current?.querySelector<HTMLElement>("[cmdk-item]");
    if (item) {
      const h = item.getBoundingClientRect().height;
      if (h > 0 && Math.abs(h - rowHeight) > 0.5) {
        setRowHeight(h);
      }
    }
  }, [open, itemCount, rowHeight]);

  const resetScroll = useCallback(() => {
    setScrollTop(0);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, []);

  const onScroll = virtualized
    ? (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
      }
    : undefined;

  return { listRef, virtualized, startIndex, endIndex, padTop, padBottom, onScroll, resetScroll };
}

/**
 * Vignette d'une option de select (partagée par `SingleSelect` et `MultiSelect`).
 * URL → image ; `null`/`""` → placeholder gris ; `undefined` → rien (option sans vignette).
 */
export const renderOptionThumbnail = (imageUrl: string | null | undefined, className?: string): React.ReactNode => {
  if (imageUrl === undefined) {
    return null;
  }
  return imageUrl ? (
    <img src={imageUrl} alt="" loading="lazy" className={cn("h-9 w-12 shrink-0 rounded object-cover", className)} />
  ) : (
    <span className={cn("flex h-9 w-12 shrink-0 items-center justify-center rounded bg-muted text-[9px] text-muted-foreground", className)}>—</span>
  );
};
