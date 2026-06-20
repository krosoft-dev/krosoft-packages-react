import { createContext } from "react";

export interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
