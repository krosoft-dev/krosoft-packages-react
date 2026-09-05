import React from "react";
import { cn } from "@/helpers/tailwind.helper";

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
