import { PageContext, PageContextType } from "@/contexts/page.context";
import { useContext } from "react";

export const usePage = (): PageContextType => {
  const context = useContext(PageContext);

  if (context === undefined) {
    throw new Error("usePage must be used within an PageProvider");
  }

  return context;
};
