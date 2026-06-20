import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useDocumentTitle = (titleKey: string, suffix?: string, appTitle?: string): void => {
  const { t } = useTranslation();
  useEffect(() => {
    const translatedTitle = t(titleKey);
    const previousTitle = document.title;

    const titleWithSuffix = suffix ? `${translatedTitle} - ${suffix}` : translatedTitle;
    const fullTitle = appTitle ? `${titleWithSuffix} | ${appTitle}` : titleWithSuffix;
    document.title = fullTitle;

    return (): void => {
      document.title = previousTitle;
    };
  }, [appTitle, suffix, t, titleKey]);
};
