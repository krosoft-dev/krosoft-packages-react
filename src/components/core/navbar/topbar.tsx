import * as React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../helpers/tailwind.helper";

export interface TopbarProps {
  // Gestion de la sidebar
  collapsed: boolean;
  isMobile: boolean;
  onToggleSidebar: () => void;

  // Actions
  actionsNode?: React.ReactNode;

  // Custom nodes (pour injecter ton UserMenu)
  userMenuNode?: React.ReactNode;
}

export const Topbar = ({ collapsed, isMobile, onToggleSidebar, actionsNode, userMenuNode }: TopbarProps): React.ReactElement => {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-[60] h-16 md:h-20 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 transition-all duration-300",
        isMobile && "left-0",
        !isMobile && collapsed && "left-[5rem]",
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
        {/* Actions injectées (Recherche, Notifications, Thème...) */}
        {actionsNode}

        {/* Menu Utilisateur Injecté (spécifique au projet) */}
        {userMenuNode}
      </div>
    </header>
  );
};
