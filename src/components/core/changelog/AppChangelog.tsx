import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/core/inputs/SearchInput";
import { filterChangelog, getChangelogTags, parseChangelog } from "@/helpers/changelog.helper";
import { cn } from "@/helpers/tailwind.helper";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { useKrosoftTranslation } from "@/i18n";
import { AppChangelogEntry } from "./AppChangelogEntry";
import { AppChangelogNav } from "./AppChangelogNav";
import { AppChangelogTagFilter } from "./AppChangelogTagFilter";

export interface AppChangelogProps {
  /**
   * Journal en markdown : une entrée par titre `## AAAA-MM-JJ HH:MM`, les plus récentes en premier.
   * Le contenu de chaque entrée est rendu par `AppMarkdown`.
   */
  content: string;
  /** Colonne de gauche avec les dates (et les filtres), sur grand écran uniquement. Vrai par défaut. */
  showNav?: boolean;
  /** Recherche et filtre par catégorie. Vrai par défaut. */
  showSearch?: boolean;
}

// Bande de lecture : une entrée devient « en cours » quand son haut passe dans les 40 % supérieurs de l'écran.
const SCROLL_SPY_MARGIN = "0px 0px -60% 0px";

/**
 * Journal des modifications : sommaire des dates dans une colonne collante à gauche (la date en cours de lecture
 * y est surlignée), entrées datées empilées à droite. Chaque date porte une ancre partageable (`#2026-10-30-1441`).
 * Sur petit écran, la colonne disparaît et les filtres passent au-dessus des entrées.
 */
export const AppChangelog = ({ content, showNav = true, showSearch = true }: AppChangelogProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { showSuccess, showError } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [readingId, setReadingId] = useState<string>();
  const entries = useMemo(() => parseChangelog(content), [content]);
  const tags = useMemo(() => getChangelogTags(entries), [entries]);
  const visibleEntries = useMemo(() => filterChangelog(entries, search, selectedTags), [entries, search, selectedTags]);

  // Ajoute ou retire une catégorie du filtre.
  const toggleTag = (tag: string): void => {
    setSelectedTags(current => (current.includes(tag) ? current.filter(selected => selected !== tag) : [...current, tag]));
  };

  const hashId = decodeURIComponent(location.hash.slice(1));
  const linkedId = visibleEntries.some(entry => entry.id === hashId) ? hashId : undefined;
  const activeId = visibleEntries.some(entry => entry.id === readingId) ? readingId : (linkedId ?? visibleEntries[0]?.id);

  // Le hash est traité par le navigateur avant le rendu des entrées : on refait le scroll une fois qu'elles sont affichées.
  useEffect(() => {
    if (!linkedId) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(linkedId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [linkedId]);

  // Suit l'entrée en cours de lecture pour la surligner dans la colonne des dates.
  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      observed => {
        observed.forEach(item => {
          if (item.isIntersecting) {
            visible.add(item.target.id);
          } else {
            visible.delete(item.target.id);
          }
        });
        const first = visibleEntries.find(entry => visible.has(entry.id));
        if (first) {
          setReadingId(first.id);
        }
      },
      { rootMargin: SCROLL_SPY_MARGIN },
    );
    visibleEntries.forEach(entry => {
      const element = document.getElementById(entry.id);
      if (element) {
        observer.observe(element);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, [visibleEntries]);

  // replace : choisir une date n'est pas une étape de navigation, le bouton retour ne doit pas la rejouer.
  const select = (id: string): void => {
    void navigate({ search: location.search, hash: `#${id}` }, { replace: true });
  };

  const copyLink = async (id: string): Promise<void> => {
    select(id);
    const url = `${window.location.origin}${location.pathname}${location.search}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      showSuccess(t("markdown.linkCopied"));
    } catch (_) {
      showError(t("markdown.linkCopyError"));
    }
  };

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("changelog.empty")}</p>;
  }

  const filters = (
    <div className="flex flex-col gap-4">
      <SearchInput search={search} onSearch={setSearch} className="md:w-full" />
      {tags.length > 0 ? (
        <AppChangelogTagFilter
          tags={tags}
          selected={selectedTags}
          onToggle={toggleTag}
          onClear={() => {
            setSelectedTags([]);
          }}
        />
      ) : null}
    </div>
  );

  return (
    <div className="flex gap-10">
      {showNav ? (
        <aside className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-60 shrink-0 flex-col gap-8 self-start lg:flex">
          {showSearch ? filters : null}
          {visibleEntries.length > 0 ? (
            <AppChangelogNav entries={visibleEntries} activeId={activeId} onSelect={select} className="min-h-0 flex-1 overflow-y-auto" />
          ) : null}
        </aside>
      ) : null}

      <div className={cn("min-w-0 flex-1", showNav && "lg:border-l lg:pl-10")}>
        {showSearch ? <div className={cn("mb-6 md:max-w-md", showNav && "lg:hidden")}>{filters}</div> : null}
        {visibleEntries.length === 0 ? <p className="text-sm text-muted-foreground">{t("changelog.noResult")}</p> : null}
        <div className="divide-y">
          {visibleEntries.map(entry => (
            <AppChangelogEntry key={entry.id} entry={entry} onSelect={select} onCopyLink={id => void copyLink(id)} selectedTags={selectedTags} />
          ))}
        </div>
      </div>
    </div>
  );
};
