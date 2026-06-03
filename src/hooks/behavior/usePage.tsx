import * as React from "react";
import { AppAction } from "@/types/AppAction";

export interface PageContextType {
  registerTitleKey: (titleKey: string) => void;
  registerDescriptionKey: (descriptionKey: string) => void;
  registerRenderPreActions: (renderPreActions: () => React.JSX.Element) => void;
  registerActions: (actions: AppAction[]) => void;
}

export const PageContext = React.createContext<PageContextType>({} as PageContextType);

export const usePage = (): PageContextType => {
  const context = React.useContext(PageContext);

  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider or AppLayout");
  }

  return context;
};
