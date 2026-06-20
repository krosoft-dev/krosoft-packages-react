import * as React from "react";
import { cn } from "@/helpers/tailwind.helper";
import { useSidebar } from "@/hooks";

export interface SidebarHeaderProps {
  name?: string;
  subName?: string;
  icon?: React.ElementType;
  dense?: boolean;
}

export const SidebarHeader = ({
  name = "appname",
  subName = "appsubname",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  icon: Icon,
  dense = false,
}: SidebarHeaderProps): React.ReactElement => {
  const { collapsed, isMobile } = useSidebar();
  const isCollapsed = isMobile ? false : collapsed;

  return (
    <div className={cn("flex items-center flex-shrink-0 gap-3 px-4", dense ? "h-14" : "h-16 md:h-20", isCollapsed ? "justify-center" : "")}>
      {Icon !== undefined && (
        <div className="flex-shrink-0 text-sidebar-foreground">
          <Icon className={dense ? "size-5" : "size-6"} />
        </div>
      )}
      {!isCollapsed && (
        <div className="flex flex-col">
          <h1 className={cn("font-bold text-sidebar-foreground leading-tight", dense ? "text-base" : "text-lg")}>{name}</h1>
          <span className={cn("text-sidebar-muted font-medium", dense ? "text-[11px]" : "text-xs")}>{subName}</span>
        </div>
      )}
    </div>
  );
};
