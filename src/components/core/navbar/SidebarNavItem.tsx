import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "@/helpers/tailwind.helper";
import { SidebarItem, SidebarSubItem } from "./Sidebar";

export interface SidebarNavItemProps extends SidebarItem {
  currentPath: string;
  collapsed: boolean;
  dense?: boolean;
  onItemClick: (path: string) => void;
}

/**
 * Détermine si un path donné est actif par rapport au currentPath,
 * en ne matchant via startsWith que s'il n'y a pas de sibling plus spécifique.
 */
const isPathActive = (path: string, currentPath: string, siblingPaths: string[]): boolean => {
  if (currentPath === path) return true;
  if (path === "/") return false;
  if (!currentPath.startsWith(`${path}/`)) return false;

  // Un sibling plus spécifique existe-t-il ?
  return !siblingPaths.some(
    sibling => sibling !== path && sibling.startsWith(`${path}/`) && (currentPath === sibling || currentPath.startsWith(`${sibling}/`)),
  );
};

export const SidebarNavItem = ({
  path,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  icon: Icon,
  label,
  badge,
  subItems,
  currentPath,
  collapsed,
  dense = false,
  onItemClick,
}: SidebarNavItemProps): React.ReactElement => {
  const subPaths = subItems?.map(item => item.path) ?? [];
  const [isOpen, setIsOpen] = React.useState(subItems?.some(item => isPathActive(item.path, currentPath, subPaths)) ?? false);

  const isActive = path ? currentPath === path || (path !== "/" && currentPath.startsWith(`${path}/`)) : false;
  const isAnyChildActive = subItems?.some(item => isPathActive(item.path, currentPath, subPaths));
  const active = isActive || (!collapsed && isAnyChildActive);

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (subItems && subItems.length > 0) {
      if (!collapsed) {
        setIsOpen(!isOpen);
      }
    } else if (path) {
      onItemClick(path);
    }
  };

  const collapsedClasses = dense ? "justify-center p-2 h-9 w-9 mx-auto" : "justify-center p-3 h-12 w-12 mx-auto";
  const expandedClasses = dense ? "px-3 py-1.5 h-9" : "px-4 py-3 h-12";
  const activeClasses = dense ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg";

  const content = (
    <a
      href={path ?? "#"}
      onClick={handleClick}
      className={cn(
        "flex items-center cursor-pointer transition-all duration-200 group",
        dense ? "gap-2.5 rounded-lg mb-0.5" : "gap-3 rounded-2xl mb-2",
        collapsed ? collapsedClasses : expandedClasses,
        active ? activeClasses : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
      )}
    >
      <div className={cn("flex-shrink-0 transition-transform group-hover:scale-110", collapsed ? "flex items-center justify-center" : "")}>
        <Icon className="size-4" />
      </div>
      {!collapsed && (
        <>
          <span className={cn("flex-grow transition-opacity duration-150 font-medium", dense ? "text-sm" : "")}>{label}</span>
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
        <div
          className={cn(
            "flex flex-col ml-4 pl-4 border-l-2 border-sidebar-border/50 animate-in slide-in-from-top-2 fade-in duration-200",
            dense ? "gap-0.5 mb-0.5" : "gap-1 mb-2",
          )}
        >
          {subItems.map((subItem, idx) => {
            const isSubActive = isPathActive(subItem.path, currentPath, subPaths);
            return (
              <a
                key={idx}
                href={subItem.path}
                onClick={e => {
                  e.preventDefault();
                  onItemClick(subItem.path);
                }}
                className={cn(
                  "flex items-center justify-between rounded-xl text-sm transition-all duration-200",
                  dense ? "px-3 py-1" : "px-4 py-2",
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

