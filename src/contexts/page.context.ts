import { AppAction } from "@/types/AppAction";
import { createContext } from "react";

export interface PageContextType {
  registerTitleKey: (titleKey: string) => void;
  registerDescriptionKey: (descriptionKey: string) => void;
  registerRenderPreActions: (renderPreActions: () => React.JSX.Element) => void;
  registerActions: (actions: AppAction[]) => void;
}

export const PageContext = createContext<PageContextType>({} as PageContextType);
