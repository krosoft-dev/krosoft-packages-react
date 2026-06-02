import * as React from "react";
import { TooltipProvider } from "../../ui/tooltip";
import { cn } from "@/helpers/tailwind.helper";
import { SidebarNavItem } from "./SidebarNavItem";
import { useMobile } from "@/hooks";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../../ui/sheet";
import { SidebarContext } from "./useSidebar";

export const SidebarProvider = ({
  children,
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange: setCollapsedProp,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}): React.JSX.Element => {
  const isMobile = useMobile();
  const [_collapsed, _setCollapsed] = React.useState(defaultCollapsed);

  const collapsed = collapsedProp ?? _collapsed;
  const setCollapsed = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const collapsedState = typeof value === "function" ? value(collapsed) : value;
      if (setCollapsedProp) {
        setCollapsedProp(collapsedState);
      } else {
        _setCollapsed(collapsedState);
      }
    },
    [setCollapsedProp, collapsed],
  );

  const toggleSidebar = React.useCallback(() => {
    setCollapsed(c => !c);
  }, [setCollapsed]);

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      collapsed,
      setCollapsed,
      isMobile,
      toggleSidebar,
    }),
    [collapsed, setCollapsed, isMobile, toggleSidebar],
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

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
}

export const Sidebar = ({
  groups,
  onItemClick,
  currentPath,
  appName = "appname",
  appSubName = "appsubname",
  appIcon: AppIcon,
  headerNode,
  footerNode,
}: SidebarProps): React.ReactElement => {
  const context = React.useContext(SidebarContext);
  const localIsMobile = useMobile();
  const isMobile = context ? context.isMobile : localIsMobile;

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  const isCollapsed = isMobile ? false : context.collapsed;
  const isMobileOpen = !context.collapsed;
  const setCollapsedState = context.setCollapsed;

  const handleItemClick = (path: string): void => {
    onItemClick(path);
    if (isMobile) {
      setCollapsedState(true);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      {headerNode ?? (
        <div className={cn("flex items-center h-16 md:h-20 flex-shrink-0 gap-3 px-4", isCollapsed ? "justify-center" : "")}>
          {AppIcon !== undefined && (
            <div className="flex-shrink-0 text-sidebar-foreground">
              <AppIcon className="size-6" />
            </div>
          )}
          {!isCollapsed && (
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
            {!isCollapsed && group.title !== undefined && group.title !== "" && (
              <h3 className="px-4 mb-2 text-xs uppercase tracking-wider font-semibold text-sidebar-muted">{group.title}</h3>
            )}
            <nav className="flex flex-col gap-1">
              {group.items.map((item, itemIdx) => (
                <SidebarNavItem key={itemIdx} {...item} currentPath={currentPath} collapsed={isCollapsed} onItemClick={handleItemClick} />
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      {footerNode && <div className={cn("p-4 border-t border-sidebar-border", isCollapsed ? "flex justify-center" : "")}>{footerNode}</div>}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet
        open={isMobileOpen}
        onOpenChange={open => {
          setCollapsedState(!open);
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
