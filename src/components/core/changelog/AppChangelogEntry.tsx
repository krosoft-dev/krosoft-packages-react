import type { JSX, MouseEvent } from "react";
import { useMemo } from "react";
import { format } from "date-fns";
import { HashIcon, LinkIcon, TagIcon } from "lucide-react";
import { AppMarkdown } from "@/components/core/markdown/AppMarkdown";
import { getChangelogItemAnchors, splitChangelogItems } from "@/helpers/changelog.helper";
import { cn } from "@/helpers/tailwind.helper";
import { useDateFnsLocale, useKrosoftTranslation } from "@/i18n";
import type { ChangelogEntry } from "@/types/ChangelogEntry";

interface AppChangelogEntryProps {
  entry: ChangelogEntry;
  onSelect: (id: string) => void;
  onCopyLink: (id: string) => void;
  /** Catégories actuellement filtrées : leurs tags sont mis en évidence. */
  selectedTags: string[];
  /** Ancre présente dans l'url : l'élément correspondant est mis en évidence. */
  linkedId?: string;
}

/** Une entrée du journal : ses éléments (catégorie + texte markdown) et les liens de partage (entrée et éléments). */
export const AppChangelogEntry = ({ entry, onSelect, onCopyLink, selectedTags, linkedId }: AppChangelogEntryProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();
  const items = useMemo(() => splitChangelogItems(entry.content), [entry.content]);
  const itemAnchors = useMemo(() => getChangelogItemAnchors(entry.id, items), [entry.id, items]);

  const date = entry.date ? format(entry.date, entry.hasTime ? "d MMMM yyyy - HH:mm" : "d MMMM yyyy", { locale }) : undefined;
  const handleDateClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    onSelect(entry.id);
  };

  // Lien de partage, affiché au survol à côté du titre (ou de la date pour une entrée sans titre).
  const copyLinkButton = (
    <button
      type="button"
      onClick={() => {
        onCopyLink(entry.id);
      }}
      title={t("markdown.copyLink")}
      aria-label={t("markdown.copyLink")}
      className="inline-flex shrink-0 text-muted-foreground transition-opacity hover:text-primary md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
    >
      <LinkIcon className="size-4" />
    </button>
  );

  return (
    <article id={entry.id} className="group scroll-mt-4 py-8 first:pt-0">
      {/* En-tête sur une ligne : version, titre, date, puis le lien de partage au survol. */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        {entry.version === undefined ? null : (
          // Version : pastille arrondie teintée avec icône, pour la distinguer des tags de catégorie (gris, sans icône).
          <span
            title={t("changelog.version", { version: entry.version })}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-primary"
          >
            <TagIcon className="size-3" aria-hidden="true" />
            {entry.version}
          </span>
        )}
        {entry.title === undefined ? null : <h2 className="text-lg font-semibold leading-tight text-foreground">{entry.title}</h2>}
        {date === undefined ? null : (
          <a href={`#${entry.id}`} onClick={handleDateClick} className="text-sm font-medium text-muted-foreground hover:text-primary">
            {date}
          </a>
        )}
        {copyLinkButton}
      </div>
      {/* Éléments décalés sous l'en-tête, pour bien les rattacher à leur version. */}
      <div className="space-y-4 pl-4 sm:pl-6">
        {items.map((item, index) => {
          const anchor = itemAnchors[index];
          return (
            <div
              key={anchor ?? `item-${String(index)}`}
              id={anchor}
              className={cn("scroll-mt-4 rounded-md", anchor !== undefined && anchor === linkedId && "-mx-3 bg-primary/5 px-3 py-2 ring-1 ring-primary/20")}
            >
              {item.tag === undefined || anchor === undefined ? null : (
                // Catégorie : simple libellé (pas de pastille), en couleur principale quand elle est filtrée.
                // Le « # » copie le lien vers cet élément.
                <p className={cn("mb-1 flex items-center gap-1.5 text-sm font-semibold", selectedTags.includes(item.tag) ? "text-primary" : "text-foreground")}>
                  <button
                    type="button"
                    onClick={() => {
                      onCopyLink(anchor);
                    }}
                    title={t("markdown.copyLink")}
                    aria-label={t("markdown.copyLink")}
                    className="inline-flex shrink-0 text-muted-foreground opacity-60 transition hover:text-primary hover:opacity-100"
                  >
                    <HashIcon className="size-3.5" aria-hidden="true" />
                  </button>
                  {item.tag}
                </p>
              )}
              {/* Texte sous la catégorie, aligné sur son libellé (icône 14 px + écart 6 px). */}
              <div className={cn("min-w-0 [&>*:last-child]:mb-0", item.tag !== undefined && "pl-5")}>
                <AppMarkdown content={item.content} headingAnchors={false} />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
