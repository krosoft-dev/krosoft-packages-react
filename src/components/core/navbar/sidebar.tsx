import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "../../../helpers/tailwind.helper";
import { Shield } from "lucide-react";

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
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
}

const NavItem = ({
  path,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  icon: Icon,
  label,
  badge,
  currentPath,
  collapsed,
  onItemClick,
}: SidebarItem & {
  currentPath: string;
  collapsed: boolean;
  onItemClick: (path: string) => void;
}): React.ReactElement => {
  const active = currentPath === path || (path !== "/" && currentPath.startsWith(`${path}/`));

  const content = (
    <a
      href={path}
      onClick={e => {
        e.preventDefault();
        onItemClick(path);
      }}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl cursor-pointer mb-2 transition-all duration-200 group",
          collapsed ? "justify-center p-3 h-12 w-12 mx-auto" : "px-4 py-3 h-12",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
            : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
        )}
      >
        <div className={cn("flex-shrink-0 transition-transform group-hover:scale-110", collapsed ? "flex items-center justify-center" : "")}>
          <Icon className="size-4" />
        </div>
        {!collapsed && <span className="flex-grow transition-opacity duration-150 font-medium">{label}</span>}
        {!collapsed && badge !== undefined && (
          <span className="bg-red-500 text-white text-xs rounded-full py-1 min-w-[20px] text-center px-2 font-semibold">{badge}</span>
        )}
      </div>
    </a>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={6}
            className="rounded-xl z-[99999] flex gap-2 bg-sidebar text-sidebar-foreground border border-sidebar-border py-2 text-sm shadow-lg"
          >
            <div className="flex items-center gap-2">
              <p>{label}</p>
              {badge !== undefined && <span className="ml-1 text-xs">({badge})</span>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export const Sidebar = ({
  groups,
  collapsed,
  mobileOpen,
  isMobile,
  onMobileClose,
  onItemClick,
  currentPath,
  appName = "Admin Panel",
  appSubName = "CRM",
}: SidebarProps): React.ReactElement => {
  const handleItemClick = (path: string): void => {
    onItemClick(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border h-screen transition-all duration-300",
        collapsed ? "w-[--sidebar-width-icon]" : "w-[--sidebar-width]",
        isMobile && !mobileOpen ? "hidden" : "flex",
      )}
      style={{
        ["--sidebar-width" as string]: "16rem",
        ["--sidebar-width-icon" as string]: "5rem",
      }}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-3 p-4", collapsed ? "justify-center" : "")}>
        <div className="flex-shrink-0 text-sidebar-foreground">
          <Shield className="size-6" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="font-bold text-lg text-sidebar-foreground leading-tight">{appName}</h1>
            <span className="text-xs text-sidebar-muted font-medium">{appSubName}</span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-sidebar-border">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6">
            {!collapsed && group.title !== undefined && group.title !== "" && (
              <h3 className="px-4 mb-2 text-xs uppercase tracking-wider font-semibold text-sidebar-muted">{group.title}</h3>
            )}
            <nav className="flex flex-col gap-1">
              {group.items.map((item, itemIdx) => (
                <NavItem key={itemIdx} {...item} currentPath={currentPath} collapsed={collapsed} onItemClick={handleItemClick} />
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};
