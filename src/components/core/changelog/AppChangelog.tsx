import type { JSX } from "react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseChangelog } from "@/helpers/changelog.helper";
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
}

/**
 * Frise d'un journal des modifications. Chaque date porte une ancre partageable (`#2026-10-30-1441`) :
 * ouvrir l'url fait défiler jusqu'à l'entrée, qui est mise en évidence dans la frise et le sommaire.
 */
export const AppChangelog = ({ content, showNav = true }: AppChangelogProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { showSuccess, showError } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const entries = useMemo(() => parseChangelog(content), [content]);

  const hashId = decodeURIComponent(location.hash.slice(1));
  const activeId = entries.some(entry => entry.id === hashId) ? hashId : undefined;

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
        {entries.map((entry, index) => (
          <AppChangelogEntry
            key={entry.id}
            entry={entry}
            isLatest={index === 0}
            isLast={index === entries.length - 1}
            isActive={entry.id === activeId}
            onSelect={select}
            onCopyLink={id => void copyLink(id)}
          />
        ))}
      </div>
      {showNav ? (
        <AppChangelogNav
          entries={entries}
          activeId={activeId}
          onSelect={select}
          className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-52 shrink-0 self-start overflow-y-auto xl:block"
        />
      ) : null}
    </div>
  );
};
