import { SidebarContext, SidebarContextType } from "@/contexts/sidebar.context";
import { useContext } from "react";

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
};
