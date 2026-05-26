import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "@/helpers/tailwind.helper";
import { SidebarItem } from "./Sidebar";

export interface SidebarNavItemProps extends SidebarItem {
  currentPath: string;
  collapsed: boolean;
  onItemClick: (path: string) => void;
}

export const SidebarNavItem = ({
  path,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  icon: Icon,
  label,
  badge,
  subItems,
  currentPath,
  collapsed,
  onItemClick,
}: SidebarNavItemProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(subItems?.some(item => currentPath === item.path || currentPath.startsWith(`${item.path}/`)) || false);

  const isActive = path ? currentPath === path || (path !== "/" && currentPath.startsWith(`${path}/`)) : false;
  const isAnyChildActive = subItems?.some(item => currentPath === item.path || currentPath.startsWith(`${item.path}/`));
  const active = isActive || (!collapsed && isAnyChildActive);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (subItems && subItems.length > 0) {
      if (!collapsed) {
        setIsOpen(!isOpen);
      }
    } else if (path) {
      onItemClick(path);
    }
  };

  const content = (
    <a
      href={path || "#"}
      onClick={handleClick}
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
      {!collapsed && (
        <>
          <span className="flex-grow transition-opacity duration-150 font-medium">{label}</span>
          {badge !== undefined && <span className="bg-red-500 text-white text-xs rounded-full py-1 min-w-[20px] text-center px-2 font-semibold">{badge}</span>}
          {subItems && subItems.length > 0 && <ChevronDownIcon className={cn("size-4 transition-transform duration-200", isOpen ? "rotate-180" : "")} />}
        </>
      )}
    </a>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={6}
            className="rounded-xl z-[99999] flex gap-2 bg-sidebar text-sidebar-foreground border border-sidebar-border py-2 text-sm shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{label}</p>
                {badge !== undefined && <span className="ml-1 text-xs">({badge})</span>}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ) : (
        content
      )}

      {!collapsed && subItems && subItems.length > 0 && isOpen && (
        <div className="flex flex-col gap-1 mb-2 ml-4 pl-4 border-l-2 border-sidebar-border/50 animate-in slide-in-from-top-2 fade-in duration-200">
          {subItems.map((subItem, idx) => {
            const isSubActive = currentPath === subItem.path || (subItem.path !== "/" && currentPath.startsWith(`${subItem.path}/`));
            return (
              <a
                key={idx}
                href={subItem.path}
                onClick={e => {
                  e.preventDefault();
                  onItemClick(subItem.path);
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-all duration-200",
                  isSubActive
                    ? "bg-sidebar-accent/50 text-sidebar-primary font-semibold"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <span>{subItem.label}</span>
                {subItem.badge !== undefined && (
                  <span className="bg-sidebar-primary/20 text-sidebar-primary text-[10px] rounded-full py-0.5 px-2 font-semibold">{subItem.badge}</span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
};
