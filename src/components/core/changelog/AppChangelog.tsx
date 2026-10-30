import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/core/inputs/SearchInput";
import { filterChangelog, parseChangelog } from "@/helpers/changelog.helper";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { useKrosoftTranslation } from "@/i18n";
import { AppChangelogEntry } from "./AppChangelogEntry";
import { AppChangelogNav } from "./AppChangelogNav";

export interface AppChangelogProps {
  /**
   * Journal en markdown : une entrée par titre `## AAAA-MM-JJ HH:MM`, les plus récentes en premier.
   * Le contenu de chaque entrée est rendu par `AppMarkdown`.
   */
  content: string;
  /** Sommaire des dates à droite de la frise (écrans larges uniquement). Vrai par défaut. */
  showNav?: boolean;
  /** Barre de recherche au-dessus de la frise (titre et contenu, sans casse ni accents). Vrai par défaut. */
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
  const entries = useMemo(() => parseChangelog(content), [content]);
  const visibleEntries = useMemo(() => filterChangelog(entries, search), [entries, search]);
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

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        {showSearch ? <SearchInput search={search} onSearch={setSearch} placeholder={t("changelog.searchPlaceholder")} className="mb-6 md:w-96" /> : null}
        {visibleEntries.length === 0 ? <p className="text-sm text-muted-foreground">{t("changelog.noResult", { query: search.trim() })}</p> : null}
        {visibleEntries.map((entry, index) => (
          <AppChangelogEntry
            key={entry.id}
            entry={entry}
            isLatest={entry.id === latestId}
            isLast={index === visibleEntries.length - 1}
            isActive={entry.id === activeId}
            onSelect={select}
            onCopyLink={id => void copyLink(id)}
          />
        ))}
      </div>
      {showNav && visibleEntries.length > 0 ? (
        <AppChangelogNav
          entries={visibleEntries}
          activeId={activeId}
          onSelect={select}
          className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-52 shrink-0 self-start overflow-y-auto xl:block"
        />
      ) : null}
    </div>
  );
};
