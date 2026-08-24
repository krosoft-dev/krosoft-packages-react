import { useKrosoftTranslation } from "@/i18n";
import * as React from "react";
import { SearchIcon } from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
import { cn } from "@/helpers/tailwind.helper";
import { SidebarNavItem } from "./SidebarNavItem";
import { useSidebar } from "@/hooks";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../../ui/sheet";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";

export interface SidebarSubItem {
  label: string;
  path: string;
  badge?: number;
}

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: number;
  subItems?: SidebarSubItem[];
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarSlots {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface SidebarSearch {
  enabled?: boolean;
  placeholder?: string;
}

export interface SidebarProps {
  groups: SidebarGroup[];
  currentPath: string;
  onItemClick: (path: string) => void;
  slots?: SidebarSlots;
  search?: SidebarSearch;
  dense?: boolean;
  loading?: boolean;
}

export const Sidebar = ({ groups, currentPath, onItemClick, slots, search, dense = false, loading = false }: SidebarProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  const { enabled: searchable = false, placeholder: searchPlaceholder } = search ?? {};
  const { header: headerNode, footer: footerNode } = slots ?? {};
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
      {headerNode}

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
              placeholder={searchPlaceholder ?? t("search.placeholder")}
              className={cn(
                "bg-sidebar-accent/40 border-sidebar-border pl-9 text-sidebar-foreground placeholder:text-sidebar-muted",
                dense ? "h-8 text-sm" : "h-9",
              )}
            />
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className={cn("flex-1 overflow-y-auto scrollbar-modern", isCollapsed ? "px-0" : "px-2", dense ? "py-2" : "py-4")}>
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className={cn("flex items-center gap-3", dense ? "mb-1 h-9" : "mb-2 h-12", isCollapsed ? "justify-center px-3" : "px-4")}>
                <Skeleton className="size-5 flex-shrink-0 rounded-control" />
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
          <SheetTitle className="sr-only">{t("sidebar.menu")}</SheetTitle>
          <SheetDescription className="sr-only">{t("sidebar.description")}</SheetDescription>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col bg-sidebar h-screen border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-[--navbar-width-icon]" : "w-[--navbar-width]",
          "flex",
        )}
        style={{
          ["--navbar-width" as string]: "16rem",
          ["--navbar-width-icon" as string]: "4rem",
        }}
      >
        {sidebarContent}
      </aside>
    </TooltipProvider>
  );
};
