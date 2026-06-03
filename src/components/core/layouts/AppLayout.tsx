import * as React from "react";
import { Sidebar, SidebarProvider, Topbar } from "@/components/core/navbar";
import type { SidebarGroup } from "@/components/core/navbar";
import { PageContext } from "@/hooks/behavior/usePage";
import { AppPageHeader } from "./AppPageHeader";
import { AppAction } from "@/types/AppAction";

export interface AppLayoutProps {
  // Navigation & Structure
  groups: SidebarGroup[];
  currentPath: string;
  onItemClick: (path: string) => void;

  // Custom nodes (Header/Topbar)
  appName?: string;
  appSubName?: string;
  appIcon?: React.ElementType;
  headerNode?: React.ReactNode;
  footerNode?: React.ReactNode;
  actionsNode?: React.ReactNode;
  userMenuNode?: React.ReactNode;

  // Page Header options
  icon?: React.ElementType;
  titleKey?: string;
  descriptionKey?: string;
  backTo?: string | null;
  hideTitle?: boolean;
  className?: string;
  
  // App Title for tab document title prefix
  appTitle?: string;

  children: React.ReactNode;
}

export function AppLayout({
  groups,
  currentPath,
  onItemClick,
  appName,
  appSubName,
  appIcon,
  headerNode,
  footerNode,
  actionsNode,
  userMenuNode,
  icon,
  titleKey,
  descriptionKey,
  backTo,
  hideTitle = false,
  appTitle,
  children,
  className,
}: AppLayoutProps): React.JSX.Element {
  // Sidebar state
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  React.useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Page context state
  const [actions, setActions] = React.useState<AppAction[]>([]);
  const [currentTitleKey, setCurrentTitleKey] = React.useState<string>(titleKey || "");
  const [currentDescriptionKey, setCurrentDescriptionKey] = React.useState<string>(descriptionKey || "");
  const [renderPreActions, setRenderPreActions] = React.useState<() => React.JSX.Element>(
    () =>
      function EmptyPreActions(): React.JSX.Element {
        return <span />;
      },
  );

  React.useLayoutEffect(() => {
    setCurrentTitleKey(titleKey || "");
    setCurrentDescriptionKey(descriptionKey || "");
    setActions([]);
    setRenderPreActions(
      () =>
        function EmptyPreActions(): React.JSX.Element {
          return <span />;
        },
    );
  }, [currentPath, titleKey, descriptionKey]);

  const registerActions = React.useCallback((a: AppAction[]) => setActions(a), []);
  const registerTitleKey = React.useCallback((k: string) => setCurrentTitleKey(k), []);
  const registerDescriptionKey = React.useCallback((k: string) => setCurrentDescriptionKey(k), []);
  const registerRenderPreActions = React.useCallback((fn: () => React.JSX.Element) => setRenderPreActions(() => fn), []);

  return (
    <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 font-sans">
        <Sidebar
          groups={groups}
          onItemClick={onItemClick}
          currentPath={currentPath}
          headerNode={headerNode}
          footerNode={footerNode}
          appName={appName}
          appSubName={appSubName}
          appIcon={appIcon}
        />
        <Topbar actionsNode={actionsNode} userMenuNode={userMenuNode} />
        <PageContext.Provider value={{ registerActions, registerTitleKey, registerDescriptionKey, registerRenderPreActions }}>
          <main className="flex-1 pt-24 px-4 md:px-8 overflow-y-auto">
            <div className="space-y-6 pb-8">
              {!hideTitle && currentTitleKey && (
                <AppPageHeader
                  icon={icon}
                  titleKey={currentTitleKey}
                  descriptionKey={currentDescriptionKey}
                  actions={actions}
                  backTo={backTo}
                  renderPreActions={renderPreActions}
                  appTitle={appTitle}
                  className={className}
                />
              )}
              {children}
            </div>
          </main>
        </PageContext.Provider>
      </div>
    </SidebarProvider>
  );
}
