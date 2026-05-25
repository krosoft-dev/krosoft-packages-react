import { cn } from "../../../helpers/tailwind.helper";
import { useTranslation } from "react-i18next";

export interface AppTitleProps {
  titleKey: string;
  descriptionKey?: string;
  isSubTitle?: boolean;
}

export function AppTitle({ titleKey, descriptionKey, isSubTitle }: AppTitleProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <h1 className={isSubTitle ? "text-xl md:text-2xl font-semibold" : "text-xl md:text-3xl font-bold"}>{t(titleKey) ?? ""}</h1>
      {descriptionKey ? <p className={cn("text-muted-foreground", isSubTitle && "text-sm")}>{t(descriptionKey)}</p> : null}
    </div>
  );
}
