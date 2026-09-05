import { cn } from "@/helpers/tailwind.helper";
import { useKrosoftTranslation } from "@/i18n";

export interface AppTitleProps {
  titleKey: string;
  descriptionKey?: string;
  isSubTitle?: boolean;
  /** Rend le sous-titre sur la même ligne que le titre (au lieu d'en dessous), en gris plus léger. */
  inline?: boolean;
}

export function AppTitle({ titleKey, descriptionKey, isSubTitle, inline }: AppTitleProps): React.JSX.Element {
  const { t } = useKrosoftTranslation();

  const titleClassName = isSubTitle ? "text-xl md:text-2xl font-semibold" : "text-xl md:text-3xl font-bold";

  if (inline) {
    return (
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <h1 className={cn("shrink-0", titleClassName)}>{t(titleKey) ?? ""}</h1>
        {descriptionKey ? <p className="min-w-0 truncate text-sm font-normal text-muted-foreground md:text-base">{t(descriptionKey)}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h1 className={titleClassName}>{t(titleKey) ?? ""}</h1>
      {descriptionKey ? <p className={cn("hidden md:block text-muted-foreground", isSubTitle && "text-sm")}>{t(descriptionKey)}</p> : null}
    </div>
  );
}
