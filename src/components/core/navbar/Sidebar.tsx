import * as React from "react";
import { TooltipProvider } from "../../ui/tooltip";
import { cn } from "@/helpers/tailwind.helper";
import { SidebarNavItem } from "./SidebarNavItem";

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: number;
  subItems?: { label: string; path: string; badge?: number }[];
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  groups: SidebarGroup[];
  collapsed: boolean;
  mobileOpen: boolean;
  isMobile: boolean;
  onMobileClose: () => void;
  onItemClick: (path: string) => void;
  currentPath: string;
  appName?: string;
  appSubName?: string;
  appIcon?: React.ElementType;
  headerNode?: React.ReactNode;
  footerNode?: React.ReactNode;
}

export const Sidebar = ({
  groups,
  collapsed,
  mobileOpen,
  isMobile,
  onMobileClose,
  onItemClick,
  currentPath,
  appName = "appname",
  appSubName = "appsubname",
  appIcon: AppIcon,
  headerNode,
  footerNode,
}: SidebarProps): React.ReactElement => {
  const handleItemClick = (path: string): void => {
    onItemClick(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col bg-sidebar h-screen transition-all duration-300",
          collapsed ? "w-[--navbar-width-icon]" : "w-[--navbar-width]",
          isMobile && !mobileOpen ? "hidden" : "flex",
        )}
        style={{
          ["--navbar-width" as string]: "16rem",
          ["--navbar-width-icon" as string]: "5rem",
        }}
      >
        {/* Header */}
        {headerNode ? (
          headerNode
        ) : (
          <div className={cn("flex items-center h-16 md:h-20 flex-shrink-0 gap-3 px-4", collapsed ? "justify-center" : "")}>
            {AppIcon !== undefined && (
              <div className="flex-shrink-0 text-sidebar-foreground">
                <AppIcon className="size-6" />
              </div>
            )}
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="font-bold text-lg text-sidebar-foreground leading-tight">{appName}</h1>
                <span className="text-xs text-sidebar-muted font-medium">{appSubName}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-modern">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-6">
              {!collapsed && group.title !== undefined && group.title !== "" && (
                <h3 className="px-4 mb-2 text-xs uppercase tracking-wider font-semibold text-sidebar-muted">{group.title}</h3>
              )}
              <nav className="flex flex-col gap-1">
                {group.items.map((item, itemIdx) => (
                  <SidebarNavItem key={itemIdx} {...item} currentPath={currentPath} collapsed={collapsed} onItemClick={handleItemClick} />
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer */}
        {footerNode && <div className={cn("p-4 border-t border-sidebar-border", collapsed ? "flex justify-center" : "")}>{footerNode}</div>}
      </aside>
    </TooltipProvider>
  );
};
