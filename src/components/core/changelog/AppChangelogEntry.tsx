import type { JSX, MouseEvent } from "react";
import { useMemo } from "react";
import { format } from "date-fns";
import { LinkIcon } from "lucide-react";
import { AppMarkdown } from "@/components/core/markdown/AppMarkdown";
import { badgeVariants } from "@/components/ui/badge";
import { splitChangelogItems } from "@/helpers/changelog.helper";
import { cn } from "@/helpers/tailwind.helper";
import { useDateFnsLocale, useKrosoftTranslation } from "@/i18n";
import type { ChangelogEntry } from "@/types/ChangelogEntry";

interface AppChangelogEntryProps {
  entry: ChangelogEntry;
  onSelect: (id: string) => void;
  onCopyLink: (id: string) => void;
  /** Catégories actuellement filtrées : leurs tags sont mis en évidence. */
  selectedTags: string[];
}

/** Une entrée du journal : ses éléments (tag de catégorie + texte markdown) et le lien de partage au survol. */
export const AppChangelogEntry = ({ entry, onSelect, onCopyLink, selectedTags }: AppChangelogEntryProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();
  const items = useMemo(() => splitChangelogItems(entry.content), [entry.content]);

  const date = entry.date ? format(entry.date, entry.hasTime ? "d MMMM yyyy - HH:mm" : "d MMMM yyyy", { locale }) : undefined;
  const handleDateClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    onSelect(entry.id);
  };

  return (
    <article id={entry.id} className="group scroll-mt-4 py-8 first:pt-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        {entry.version === undefined ? null : (
          <span className={cn(badgeVariants({ variant: "secondary" }), "rounded-full hover:bg-secondary")}>
            {t("changelog.version", { version: entry.version })}
          </span>
        )}
        {date === undefined ? null : (
          <a href={`#${entry.id}`} onClick={handleDateClick} className="text-sm font-medium text-muted-foreground hover:text-primary">
            {date}
          </a>
        )}
      </div>
      {entry.title === undefined ? null : <h2 className="mb-4 text-xl font-semibold leading-tight text-foreground">{entry.title}</h2>}
      <div className="flex gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          {items.map((item, index) => (
            <div key={`${item.tag ?? ""}-${String(index)}`} className="flex flex-col items-start gap-1.5 sm:flex-row sm:gap-3">
              {item.tag === undefined ? null : (
                <span
                  className={cn(
                    badgeVariants({ variant: selectedTags.includes(item.tag) ? "default" : "secondary" }),
                    // Pastille informative : pas d'effet de survol qui la ferait passer pour un bouton.
                    selectedTags.includes(item.tag) ? "hover:bg-primary" : "hover:bg-secondary",
                    "mt-0.5 shrink-0",
                  )}
                >
                  {item.tag}
                </span>
              )}
              <div className="min-w-0 [&>*:last-child]:mb-0">
                <AppMarkdown content={item.content} headingAnchors={false} />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            onCopyLink(entry.id);
          }}
          title={t("markdown.copyLink")}
          aria-label={t("markdown.copyLink")}
          className="mt-0.5 inline-flex h-fit shrink-0 text-muted-foreground transition-opacity hover:text-primary md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
        >
          <LinkIcon className="size-4" />
        </button>
      </div>
    </article>
  );
};
