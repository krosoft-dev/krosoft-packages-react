import * as React from "react";
import { BellIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../helpers/tailwind.helper";

export interface KrosoftTopbarProps {
  // Gestion de la sidebar
  collapsed: boolean;
  isMobile: boolean;
  onToggleSidebar: () => void;

  // Actions
  onSearchClick?: () => void;

  // Thème
  theme?: string;
  onToggleTheme?: () => void;

  // Notifications
  hasNotifications?: boolean;
  onNotificationsClick?: () => void;

  // Custom nodes (pour injecter ton UserMenu)
  userMenuNode?: React.ReactNode;
}

export const KrosoftTopbar = ({
  collapsed,
  isMobile,
  onToggleSidebar,
  onSearchClick,
  theme,
  onToggleTheme,
  hasNotifications = false,
  onNotificationsClick,
  userMenuNode,
}: KrosoftTopbarProps): React.ReactElement => {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-[60] h-16 md:h-20 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 transition-all duration-300",
        isMobile && "left-0",
        !isMobile && collapsed && "left-[5.5rem]",
        !isMobile && !collapsed && "left-[16rem]",
      )}
      tabIndex={-1}
    >
      {/* Bouton Menu Burger */}
      <div className="flex items-center min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <MenuIcon className="size-4" />
        </Button>
      </div>

      {/* Actions à droite */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Recherche */}
        {onSearchClick !== undefined && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <SearchIcon className="size-4" />
          </Button>
        )}

        {/* Theme Toggle */}
        {onToggleTheme !== undefined && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {theme === "dark" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {/* Notifications */}
        {onNotificationsClick !== undefined && (
          <Button
            size="icon"
            variant="ghost"
            className="relative text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={onNotificationsClick}
          >
            <BellIcon className="h-4 w-4" />
            {hasNotifications === true && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
          </Button>
        )}

        {/* Menu Utilisateur Injecté (spécifique au projet) */}
        {userMenuNode}
      </div>
    </header>
  );
};
