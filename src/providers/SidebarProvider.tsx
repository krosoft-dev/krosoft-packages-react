import { SidebarContext } from "@/contexts/sidebar.context";
import { useMobile } from "@/hooks";
import * as React from "react";

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
