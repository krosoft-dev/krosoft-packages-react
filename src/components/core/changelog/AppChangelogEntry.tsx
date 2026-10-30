import type { JSX } from "react";
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
  isLatest: boolean;
  isLast: boolean;
  isActive: boolean;
  onSelect: (id: string) => void;
  onCopyLink: (id: string) => void;
  /** Catégories actuellement filtrées : leurs tags sont mis en évidence. */
  selectedTags: string[];
}

/** Une entrée de la frise : date et pastille à gauche, reliées par un trait, contenu markdown dans une carte à droite. */
export const AppChangelogEntry = ({ entry, isLatest, isLast, isActive, onSelect, onCopyLink, selectedTags }: AppChangelogEntryProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();
  const items = useMemo(() => splitChangelogItems(entry.content), [entry.content]);

  return (
    <section id={entry.id} className="group flex scroll-mt-4 gap-4">
      <div className="flex w-24 shrink-0 flex-col items-center">
        <a
          href={`#${entry.id}`}
          onClick={event => {
            event.preventDefault();
            onSelect(entry.id);
          }}
          className={cn("mb-2 text-center text-xs font-medium leading-tight text-muted-foreground hover:text-primary", isActive && "text-primary")}
        >
          {entry.date ? (
            <>
              <span className="block">{format(entry.date, "d MMM yyyy", { locale })}</span>
              {entry.hasTime ? <span className="block opacity-70">{format(entry.date, "HH:mm", { locale })}</span> : null}
            </>
          ) : (
            entry.title
          )}
        </a>
        <div
          className={cn("relative z-10 size-3 shrink-0 rounded-full", isLatest ? "bg-primary" : "bg-muted-foreground/40", isActive && "ring-4 ring-primary/20")}
        />
        {isLast ? null : <div className="w-0.5 grow bg-border" />}
      </div>

      <div className={cn("relative mb-6 min-w-0 grow rounded-lg border bg-card px-5 py-4 pr-12 shadow-sm transition-colors", isActive && "border-primary/50")}>
        <button
          type="button"
          onClick={() => {
            onCopyLink(entry.id);
          }}
          title={t("markdown.copyLink")}
          aria-label={t("markdown.copyLink")}
          className="absolute right-4 top-4 inline-flex text-muted-foreground transition-opacity hover:text-primary md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
        >
          <LinkIcon className="size-4" />
        </button>
        <div className="space-y-3">
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
      </div>
    </section>
  );
};
