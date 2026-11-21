import React from "react";
import { Badge } from "@/components/ui/badge";
import { getBadgeColor, type BadgeColor, type BadgeColorName } from "@/helpers/badgeColor.helper";
import { cn } from "@/helpers/tailwind.helper";

interface AppStatusBadgeProps {
  color: BadgeColorName | BadgeColor;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

/** Badge de statut coloré, précédé par défaut d'une pastille de la même teinte. */
export const AppStatusBadge = ({ color, children, className, dot = true }: AppStatusBadgeProps): React.JSX.Element => {
  const resolved = typeof color === "string" ? getBadgeColor(color) : color;
  return (
    <Badge variant="outline" className={cn("gap-1.5 whitespace-nowrap font-medium", resolved.badgeClassName, className)}>
      {dot ? <span className={cn("size-1.5 rounded-full", resolved.dotClassName)} /> : null}
      {children}
    </Badge>
  );
};
