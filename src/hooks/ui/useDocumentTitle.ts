import { useContext, useEffect } from "react";
import { DocumentTitleContext } from "@/contexts/documentTitle.context";
import { useKrosoftTranslation } from "@/i18n";

export const useDocumentTitle = (titleKey: string, suffix?: string, appTitle?: string): void => {
  const { t } = useKrosoftTranslation();
  const contextAppTitle = useContext(DocumentTitleContext);
  const resolvedAppTitle = appTitle ?? contextAppTitle;

  useEffect(() => {
    const translatedTitle = t(titleKey);
    const previousTitle = document.title;

    const titleWithSuffix = suffix ? `${translatedTitle} - ${suffix}` : translatedTitle;
    const fullTitle = resolvedAppTitle ? `${titleWithSuffix} | ${resolvedAppTitle}` : titleWithSuffix;
    document.title = fullTitle;

    return (): void => {
      document.title = previousTitle;
    };
  }, [resolvedAppTitle, suffix, t, titleKey]);
};
