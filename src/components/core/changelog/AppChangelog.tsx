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
  /** Sommaire des dates à droite de la frise (écrans larges uniquement). Vrai par défaut. */
  showNav?: boolean;
  /** Recherche et filtre par catégorie (colonne de droite sur grand écran, au-dessus de la frise sinon). Vrai par défaut. */
  showSearch?: boolean;
}

/**
 * Frise d'un journal des modifications. Chaque date porte une ancre partageable (`#2026-10-30-1441`) :
 * ouvrir l'url fait défiler jusqu'à l'entrée, qui est mise en évidence dans la frise et le sommaire.
 */
export const AppChangelog = ({ content, showNav = true, showSearch = true }: AppChangelogProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { showSuccess, showError } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const entries = useMemo(() => parseChangelog(content), [content]);
  const tags = useMemo(() => getChangelogTags(entries), [entries]);
  const visibleEntries = useMemo(() => filterChangelog(entries, search, selectedTags), [entries, search, selectedTags]);

  // Ajoute ou retire une catégorie du filtre.
  const toggleTag = (tag: string): void => {
    setSelectedTags(current => (current.includes(tag) ? current.filter(selected => selected !== tag) : [...current, tag]));
  };
  // La pastille colorée reste sur la dernière entrée publiée, même quand la recherche la masque.
  const latestId = entries[0]?.id;

  const hashId = decodeURIComponent(location.hash.slice(1));
  const activeId = visibleEntries.some(entry => entry.id === hashId) ? hashId : undefined;

  // Le hash est traité par le navigateur avant le rendu de la frise : on refait le scroll une fois les entrées affichées.
  useEffect(() => {
    if (!activeId) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(activeId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [activeId]);

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

  // Recherche puis tags de catégorie : dans la colonne de droite (stacked) ou au-dessus de la frise.
  const renderFilters = (stacked: boolean): JSX.Element => (
    <div className="flex flex-col gap-4">
      <SearchInput search={search} onSearch={setSearch} placeholder={t("changelog.searchPlaceholder")} className={stacked ? "md:w-full" : "md:w-96"} />
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

  // Sur grand écran, les filtres rejoignent le sommaire des dates dans la colonne de droite.
  const hasSideColumn = showNav;
  const hasFilters = showSearch;

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        {hasFilters ? <div className={cn("mb-6", hasSideColumn && "xl:hidden")}>{renderFilters(false)}</div> : null}
        {visibleEntries.length === 0 ? <p className="text-sm text-muted-foreground">{t("changelog.noResult")}</p> : null}
        {visibleEntries.map((entry, index) => (
          <AppChangelogEntry
            key={entry.id}
            entry={entry}
            isLatest={entry.id === latestId}
            isLast={index === visibleEntries.length - 1}
            isActive={entry.id === activeId}
            onSelect={select}
            onCopyLink={id => void copyLink(id)}
            selectedTags={selectedTags}
          />
        ))}
      </div>
      {hasSideColumn ? (
        <aside className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-64 shrink-0 flex-col gap-6 self-start xl:flex">
          {hasFilters ? renderFilters(true) : null}
          {visibleEntries.length > 0 ? (
            <AppChangelogNav entries={visibleEntries} activeId={activeId} onSelect={select} className="min-h-0 flex-1 overflow-y-auto" />
          ) : null}
        </aside>
      ) : null}
    </div>
  );
};
