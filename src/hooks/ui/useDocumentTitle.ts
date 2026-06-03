import { useEffect } from "react";

export const useDocumentTitle = (title: string, appTitle?: string): void => {
  useEffect(() => {
    const previousTitle = document.title;
    const baseTitle = appTitle || "";
    document.title = title ? (baseTitle ? `${title} - ${baseTitle}` : title) : baseTitle;

    return (): void => {
      document.title = previousTitle;
    };
  }, [title, appTitle]);
};
