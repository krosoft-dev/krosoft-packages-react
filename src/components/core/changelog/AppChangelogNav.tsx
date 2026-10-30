import type { JSX } from "react";
import { format } from "date-fns";
import { cn } from "@/helpers/tailwind.helper";
import { useDateFnsLocale, useKrosoftTranslation } from "@/i18n";
import type { ChangelogEntry } from "@/types/ChangelogEntry";

interface AppChangelogNavProps {
  entries: ChangelogEntry[];
  activeId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

/** Sommaire des dates de la frise : un clic fait défiler jusqu'à l'entrée (et pose son ancre dans l'url). */
export const AppChangelogNav = ({ entries, activeId, onSelect, className }: AppChangelogNavProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();

  return (
    <nav aria-label={t("changelog.nav")} className={className}>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("changelog.nav")}</p>
      <ul className="space-y-0.5 border-l">
        {entries.map(entry => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={event => {
                event.preventDefault();
                onSelect(entry.id);
              }}
              className={cn(
                "-ml-px block border-l-2 border-transparent px-3 py-1 text-sm text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
                entry.id === activeId && "border-primary font-medium text-primary hover:border-primary hover:text-primary",
              )}
            >
              {entry.date ? format(entry.date, entry.hasTime ? "d MMM yyyy · HH:mm" : "d MMM yyyy", { locale }) : entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
