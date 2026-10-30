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

/** Liste des dates du journal : la date en cours de lecture est surlignée, un clic fait défiler jusqu'à l'entrée (et pose son ancre). */
export const AppChangelogNav = ({ entries, activeId, onSelect, className }: AppChangelogNavProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();

  return (
    <nav aria-label={t("changelog.nav")} className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("changelog.nav")}</p>
      <ul className="space-y-1">
        {entries.map(entry => {
          const isActive = entry.id === activeId;
          const date = entry.date ? format(entry.date, entry.hasTime ? "d MMM yyyy - HH:mm" : "d MMM yyyy", { locale }) : undefined;
          // Ligne principale : le titre s'il existe, sinon la date ; la version (et la date) passent en ligne secondaire.
          const primary = entry.title ?? date ?? entry.heading;
          const secondary = [
            entry.version === undefined ? undefined : t("changelog.version", { version: entry.version }),
            entry.title === undefined ? undefined : date,
          ]
            .filter(Boolean)
            .join("  ");
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={event => {
                  event.preventDefault();
                  onSelect(entry.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block rounded-md border border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "border-border bg-muted text-foreground",
                )}
              >
                <span className={cn("block", isActive && "font-semibold")}>{primary}</span>
                {secondary === "" ? null : <span className="mt-0.5 block whitespace-pre text-xs text-muted-foreground">{secondary}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
