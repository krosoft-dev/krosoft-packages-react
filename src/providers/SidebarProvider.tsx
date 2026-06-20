import { SidebarContext, SidebarContextType } from "@/contexts/sidebar.context";
import { useMobile } from "@/hooks";
import * as React from "react";

const SIDEBAR_COOKIE_NAME = "sidebar:collapsed";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const readCollapsedCookie = (fallback: boolean): boolean => {
  if (typeof document === "undefined") {
    return fallback;
  }
  const match = document.cookie.split("; ").find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
  if (match === undefined) {
    return fallback;
  }
  return match.split("=")[1] === "true";
};

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
  const [_collapsed, _setCollapsed] = React.useState(() => readCollapsedCookie(defaultCollapsed));

  const collapsed = collapsedProp ?? _collapsed;
  const setCollapsed = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const collapsedState = typeof value === "function" ? value(collapsed) : value;
      if (setCollapsedProp) {
        setCollapsedProp(collapsedState);
      } else {
        _setCollapsed(collapsedState);
      }

      // Mémorise l'état de la sidebar dans un cookie.
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${String(collapsedState)}; path=/; max-age=${String(SIDEBAR_COOKIE_MAX_AGE)}`;
      }
    },
    [setCollapsedProp, collapsed],
  );

  const toggleSidebar = React.useCallback(() => {
    setCollapsed(c => !c);
  }, [setCollapsed]);

  // Raccourci clavier (Cmd/Ctrl+B) pour replier/déplier la sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  const contextValue = React.useMemo<SidebarContextType>(
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
