import * as React from "react";
import { SearchIcon } from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
import { cn } from "@/helpers/tailwind.helper";
import { SidebarNavItem } from "./SidebarNavItem";
import { useSidebar } from "@/hooks";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../../ui/sheet";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";

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
  onItemClick: (path: string) => void;
  currentPath: string;
  appName?: string;
  appSubName?: string;
  appIcon?: React.ElementType;
  headerNode?: React.ReactNode;
  footerNode?: React.ReactNode;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  dense?: boolean;
}

export const Sidebar = ({
  groups,
  onItemClick,
  currentPath,
  appName = "appname",
  appSubName = "appsubname",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  appIcon: AppIcon,
  headerNode,
  footerNode,
  loading = false,
  searchable = false,
  searchPlaceholder = "Rechercher...",
  dense = false,
}: SidebarProps): React.ReactElement => {
  const { collapsed, isMobile, setCollapsed } = useSidebar();
  const [query, setQuery] = React.useState("");

  const isCollapsed = isMobile ? false : collapsed;
  const isMobileOpen = !collapsed;

  const handleItemClick = (path: string): void => {
    onItemClick(path);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups =
    normalizedQuery === ""
      ? groups
      : groups
          .map(group => ({
            ...group,
            items: group.items.filter(
              item =>
                item.label.toLowerCase().includes(normalizedQuery) ||
                (item.subItems?.some(subItem => subItem.label.toLowerCase().includes(normalizedQuery)) ?? false),
            ),
          }))
          .filter(group => group.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      {headerNode ?? (
        <div className={cn("flex items-center flex-shrink-0 gap-3 px-4", dense ? "h-14" : "h-16 md:h-20", isCollapsed ? "justify-center" : "")}>
          {AppIcon !== undefined && (
            <div className="flex-shrink-0 text-sidebar-foreground">
              <AppIcon className={dense ? "size-5" : "size-6"} />
            </div>
          )}
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className={cn("font-bold text-sidebar-foreground leading-tight", dense ? "text-base" : "text-lg")}>{appName}</h1>
              <span className={cn("text-sidebar-muted font-medium", dense ? "text-[11px]" : "text-xs")}>{appSubName}</span>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {searchable && !isCollapsed && (
        <div className={cn("px-4", dense ? "pt-2" : "pt-4")}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sidebar-muted" />
            <Input
              type="search"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
              }}
              placeholder={searchPlaceholder}
              className={cn(
                "bg-sidebar-accent/40 border-sidebar-border pl-9 text-sidebar-foreground placeholder:text-sidebar-muted",
                dense ? "h-8 text-sm" : "h-9",
              )}
            />
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className={cn("flex-1 overflow-y-auto px-2 scrollbar-modern", dense ? "py-2" : "py-4")}>
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className={cn("flex items-center gap-3", dense ? "mb-1 h-9" : "mb-2 h-12", isCollapsed ? "justify-center px-3" : "px-4")}>
                <Skeleton className="size-5 flex-shrink-0 rounded-md" />
                {!isCollapsed && <Skeleton className="h-4 flex-1" />}
              </div>
            ))
          : filteredGroups.map((group, groupIdx) => (
              <div key={groupIdx} className={dense ? "mb-3" : "mb-6"}>
                {!isCollapsed && group.title !== undefined && group.title !== "" && (
                  <h3 className={cn("px-4 text-xs uppercase tracking-wider font-semibold text-sidebar-muted", dense ? "mb-1" : "mb-2")}>{group.title}</h3>
                )}
                <nav className={cn("flex flex-col", dense ? "gap-0.5" : "gap-1")}>
                  {group.items.map((item, itemIdx) => (
                    <SidebarNavItem key={itemIdx} {...item} currentPath={currentPath} collapsed={isCollapsed} dense={dense} onItemClick={handleItemClick} />
                  ))}
                </nav>
              </div>
            ))}
      </div>

      {/* Footer */}
      {footerNode && <div className={cn("border-t border-sidebar-border", dense ? "p-2" : "p-4", isCollapsed ? "flex justify-center" : "")}>{footerNode}</div>}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet
        open={isMobileOpen}
        onOpenChange={open => {
          setCollapsed(!open);
        }}
      >
        <SheetContent side="left" className="w-[16rem] p-0 bg-sidebar border-r border-sidebar-border overflow-hidden [&>button]:text-sidebar-foreground">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigation principale de l&apos;application</SheetDescription>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn("flex flex-col bg-sidebar h-screen transition-all duration-300", isCollapsed ? "w-[--navbar-width-icon]" : "w-[--navbar-width]", "flex")}
        style={{
          ["--navbar-width" as string]: "16rem",
          ["--navbar-width-icon" as string]: "5rem",
        }}
      >
        {sidebarContent}
      </aside>
    </TooltipProvider>
  );
};
